import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { Product } from 'src/products/schema/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async addItem(userId: Types.ObjectId, dto: AddToCartDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { productId, quantity } = dto;

      const product = await this.productModel
        .findById(productId)
        .session(session)
        .lean();

      if (!product) throw new NotFoundException('Product not found');

      if (product.stock < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      const updated = await this.cartModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          'items.productId': new Types.ObjectId(productId),
        },
        {
          $inc: {
            'items.$.quantity': quantity,
            totalAmount: product.price * quantity,
          },
        },
        { new: true, session },
      );

      if (!updated) {
        await this.cartModel.findOneAndUpdate(
          { userId: new Types.ObjectId(userId) },
          {
            $push: { items: { productId, quantity, price: product.price } },
            $inc: { totalAmount: product.price * quantity },
          },
          { upsert: true, new: true, session },
        );
      }

      await session.commitTransaction();
      return { message: 'Success' };
    } catch (error) {
      await session.abortTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Transaction failed: ' + error.message,
      );
    } finally {
      session.endSession();
    }
  }
  //
  async getCart(userId?: string, guestId?: string) {
    // ვქმნით დინამიურ Query-ს
    const query: any = {};

    if (userId) {
      query.userId = new Types.ObjectId(userId);
    } else if (guestId) {
      query.guestId = guestId;
    } else {
      throw new BadRequestException('User identification is missing');
    }

    const cart = await this.cartModel
      .findOne(query)
      .populate('items.productId')
      .lean()
      .exec();

    if (!cart) throw new NotFoundException('Cart not found');

    return cart;
  }
  //

  async updateItem(userId: string, dto: UpdateCartDto) {
    const { productId, quantity } = dto;
    const uId = new Types.ObjectId(userId);
    const pId = new Types.ObjectId(productId);

    const product = await this.productModel.findById(pId).lean();

    const cart = await this.cartModel.findOne({ userId: uId });
    const item = cart?.items.find((i) => i.productId.toString() === productId);

    if (!item) throw new NotFoundException('Item not found');

    // 3. გამოვთვლით სხვაობას
    const quantityDiff = quantity - item.quantity;
    const priceDiff = quantityDiff * product!.price;

    // 4. ვაკეთებთ განახლებას
    return this.cartModel
      .findOneAndUpdate(
        { userId: uId, 'items.productId': pId },
        {
          $set: { 'items.$.quantity': quantity },
          $inc: { totalAmount: priceDiff },
        },
        { new: true },
      )
      .populate('items.productId');
  }
  //

  async mergeCarts(userId: string, guestCartId: string) {
    const userCart = await this.cartModel.findOne({ userId });
    const guestCart = await this.cartModel.findOne({ _id: guestCartId });

    if (!guestCart) return;

    if (!userCart) {
      // თუ მომხმარებელს არ აქვს კალათა, უბრალოდ გადავუწეროთ Guest-ის კალათა
      await this.cartModel.updateOne({ _id: guestCartId }, { userId });
    } else {
      // თუ ორივე კალათა არსებობს, ვუმატებთ ნივთებს
      for (const item of guestCart.items) {
        const existingItem = userCart.items.find(
          (i) => i.productId.toString() === item.productId.toString(),
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          userCart.items.push(item);
        }
      }
      userCart.totalAmount += guestCart.totalAmount;
      await userCart.save();

      // წავშალოთ Guest-ის დროებითი კალათა
      await this.cartModel.findByIdAndDelete(guestCartId);
    }
  }

  //
  async removeItem(userId: string, productId: string) {
    const pId = new Types.ObjectId(productId);
    const uId = new Types.ObjectId(userId);

    // 1. ჯერ ვპოულობთ ნივთს ფასის გასაგებად (რათა totalAmount დავაკლოთ)
    const cart = await this.cartModel.findOne({ userId: uId });
    const item = cart?.items.find((i) => i.productId.toString() === productId);

    if (!item) throw new NotFoundException('Item not found in cart');

    // 2. ვანახლებთ კალათას
    return this.cartModel.findOneAndUpdate(
      { userId: uId },
      {
        $pull: { items: { productId: pId } },
        $inc: { totalAmount: -(item.price * item.quantity) },
      },
      { new: true },
    );
  }

  //კალატის გასუფთავება
  async clearCart(userId: string) {
    return this.cartModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $set: { items: [], totalAmount: 0 },
      },
      { new: true },
    );
  }
}
