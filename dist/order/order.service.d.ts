import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { Product } from "../products/schema/product.schema";
import { EmailSenderService } from "../email-sender/email-sender.service";
import { User } from "../users/schema/user.entity";
import { CreateOrderDto } from './dto/order.dto';
export declare class OrderService {
    private readonly orderModel;
    private readonly productModel;
    private readonly userModel;
    private readonly emailService;
    constructor(orderModel: Model<Order>, productModel: Model<Product>, userModel: Model<User>, emailService: EmailSenderService);
    updateStatus(orderId: string, status: string): Promise<Order>;
    private decrementInventory;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findOne(id: string): Promise<Order>;
}
