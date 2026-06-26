import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @ApiOperation({ summary: 'პროდუქტების სია (ფილტრაციით)' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.productsService.findAll(search, pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'პროდუქტის მიღება ID-ით' })
  @ApiParam({ name: 'id', description: 'პროდუქტის უნიკალური ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'ახალი პროდუქტის შექმნა (მხოლოდ ადმინისტრატორისთვის)',
  })
  @ApiConsumes('multipart/form-data') // აუცილებელია ფაილის ატვირთვისთვის
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        category: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' }, // ფაილის ატვირთვის ველი
      },
    },
  })
  @Post()
  @ApiSecurity('token')
  @UseGuards(IsAdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productsService.create(createProductDto, file);
  }

  @ApiOperation({ summary: 'პროდუქტის წაშლა (მხოლოდ ადმინისტრატორისთვის)' })
  @ApiParam({ name: 'id' })
  @ApiSecurity('token')
  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
