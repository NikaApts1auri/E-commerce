import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { DiscountService } from 'src/discount/discount.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly awsS3Service: AwsS3Service,
    private readonly discountService: DiscountService,
  ) {}

  // ფასდაკლების ლოგიკა ერთი პროდუქტისთვის
  private async applyDiscountToProduct(product: any) {
    const activeDiscount =
      await this.discountService.getActiveDiscountForProduct(
        product._id.toString(),
      );

    if (!activeDiscount) {
      return {
        ...product,
        discount: {
          isOnSale: false,
          percentage: 0,
          oldPrice: product.price,
        },
      };
    }

    const percentage = activeDiscount.percentage;
    const oldPrice = product.price;
    const currentPrice = Number((oldPrice * (1 - percentage / 100)).toFixed(2));

    return {
      ...product,
      price: currentPrice,
      discount: {
        isOnSale: true,
        percentage,
        oldPrice,
      },
    };
  }

  // დამხმარე მეთოდი ფასდაკლებების მისამაგრებლად (მუშაობს როგორც მასივზე, ისე ერთ ობიექტზე)
  private async applyDiscounts(products: any | any[]) {
    if (Array.isArray(products)) {
      return Promise.all(products.map((p) => this.applyDiscountToProduct(p)));
    }
    return this.applyDiscountToProduct(products);
  }

  async findAll(search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query: any = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productCode: { $regex: search, $options: 'i' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit).lean().exec(),
      this.productModel.countDocuments(query),
    ]);

    const productsWithDiscounts = await this.applyDiscounts(products);

    return {
      products: productsWithDiscounts,
      meta: { total, page, lastPage: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .lean()
      .exec();

    if (!product) throw new NotFoundException('პროდუქტი ვერ მოიძებნა');

    return await this.applyDiscounts(product);
  }

  private async generateUniqueProductCode(): Promise<string> {
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      code = Math.floor(10000 + Math.random() * 90000).toString();
      const existing = await this.productModel.findOne({ productCode: code });
      if (!existing) isUnique = true;
    }
    return code;
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    const autoProductCode = await this.generateUniqueProductCode();

    // 3. სურათის დამუშავება
    let imageUrl: string;
    if (file) {
      const filePath = `products/${Date.now()}_${file.originalname}`;
      await this.awsS3Service.uploadFile(filePath, file);
      imageUrl = await this.awsS3Service.getFile(filePath);
    } else {
      imageUrl = 'https://default-image-url.com/placeholder.jpg';
    }

    // 4. პროდუქტის შექმნა
    const newProduct = new this.productModel({
      ...createProductDto,
      category: createProductDto.category.toLowerCase(),
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
