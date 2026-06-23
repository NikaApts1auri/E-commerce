import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  //
  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    let query: any = { isDeleted: { $ne: true } };

    if (search) {
      query = {
        $and: [
          { isDeleted: { $ne: true } },
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { productCode: { $regex: search, $options: 'i' } },
            ],
          },
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
  private async generateUniqueProductCode(): Promise<string> {
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      code = Math.floor(10000 + Math.random() * 90000).toString();

      const existing = await this.productModel.findOne({ productCode: code });
      if (!existing) {
        isUnique = true;
      }
    }

    return code;
  }

  async create(createProductDto: CreateProductDto) {
    const autoProductCode = await this.generateUniqueProductCode();

    const newProduct = new this.productModel({
      ...createProductDto,
      productCode: autoProductCode,
    });

    return await newProduct.save();
  }

  async createWithImage(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('პროდუქტის ფოტო სავალდებულოა');

    const autoProductCode = await this.generateUniqueProductCode();

    const filePath = `products/${Date.now()}_${file.originalname}`;
    await this.awsS3Service.uploadFile(filePath, file);

    const imageUrl = await this.awsS3Service.getFile(filePath);

    const newProduct = new this.productModel({
      ...createProductDto,
      productCode: autoProductCode,
      image: imageUrl,
    });

    return await newProduct.save();
  }

  async remove(id: string) {
    const deletedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!deletedProduct) {
      throw new NotFoundException('პროდუქტი ვერ მოიძებნა');
    }

    return { message: 'პროდუქტი წარმატებით წაიშალა (Soft Delete)' };
  }
}
