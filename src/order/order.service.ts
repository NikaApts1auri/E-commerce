import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { Product } from 'src/products/schema/product.schema';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { User } from 'src/users/schema/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly emailService: EmailSenderService,
  ) {}

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    if (status === 'paid') {
      // 1. მარაგების კლება
      await this.decrementInventory(updatedOrder);

      // 2. იუზერის პოვნა და ემაილის გაგზავნა
      const user = await this.userModel.findById(updatedOrder.userId);
      if (user && user.email) {
        await this.emailService.sendEmailSomeone({
          to: user.email,
          subject: 'თქვენი შეკვეთა წარმატებით გადაიხადეთ!',
          text: `გამარჯობა! თქვენი შეკვეთა #${orderId} დამუშავებულია.`,
          html: `<h1>მადლობა შენაძენისთვის!</h1>`,
        });
      }
    }

    return updatedOrder;
  }

  private async decrementInventory(order: Order) {
    for (const item of order.items) {
      const productId = item.productId || item._id;
      await this.productModel.findByIdAndUpdate(productId, {
        $inc: { stock: -1 },
      });
    }
    console.log(`Inventory decremented for order: ${order._id}`);
  }
}
