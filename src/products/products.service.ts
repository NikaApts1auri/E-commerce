import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { productCode: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [products, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  //
  async create(createProductDto: CreateProductDto) {
    const existing = await this.productModel.findOne({
      productCode: createProductDto.productCode,
    });

    if (existing) {
      throw new BadRequestException('Product with this code already exists');
    }

    const newProduct = new this.productModel(createProductDto);
    return await newProduct.save();
  }

  //

  async remove(id: string) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: 'Product deleted successfully', id };
  }
}
