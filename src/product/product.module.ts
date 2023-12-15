import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CATEGORY } from '../entities/category.entity';
import { PRODUCT_GENERAL } from '../entities/productGeneral';
import { PRODUCT_VARIATIONS } from '../entities/productVariation.entity';
import { PRODUCT_DESCRIPTION } from '../entities/productDescription.entity';
import { CUSTOMER } from 'src/entities/customer.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CATEGORY,
      PRODUCT_GENERAL,
      PRODUCT_VARIATIONS,
      PRODUCT_DESCRIPTION,
      CUSTOMER,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
