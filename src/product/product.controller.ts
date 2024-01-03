import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { cartItem } from 'src/dto/product/cartDTO.sto';

@Controller('product')
export class ProductController {
  constructor(private productServices: ProductService) {}

  @Get('')
  getProductDetailByID(@Query('productId') product_id: number) {
    return this.productServices.getProductDetail(product_id);
  }
  @Get('/categories')
  GetCategories() {
    return this.productServices.getAllCategory();
  }
  @Post('/productCartInfo')
  getCartInfo(@Body() data: cartItem[]) {
    if (data.length == 0) throw new BadRequestException();
    return this.productServices.getCartProductInfo(data);
  }
  @Get('/productlist')
  getProductList() {
    return this.productServices.getProductListByCategoryId(null);
  }
  @Get('/productlist/:category_id')
  getProductByCategory(@Param('category_id') category_id: number) {
    if (Number.isNaN(category_id))
      throw new BadRequestException('category_id is not a number');
    return this.productServices.getProductListByCategoryId(category_id);
  }
  @Get('/find')
  findProduct(@Query('search_key') searchKey: string) {
    return this.productServices.findProduct(searchKey);
  }
}
