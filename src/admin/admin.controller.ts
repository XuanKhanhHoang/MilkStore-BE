import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomerService } from 'src/customer/customer.service';
import { createProductDTO } from 'src/dto/admin/createProductDTO.dto';
import { updateProductDTO } from 'src/dto/admin/updateProductDTO.dto';
import { addCustomerDTO } from 'src/dto/customer/addCustomer.dto';
import { updateCustomerDTO } from 'src/dto/customer/updateCustomer.dto';
import { ProductService } from 'src/product/product.service';

@Controller('admin')
export class AdminController {
  constructor(
    private ProductService: ProductService,
    private CustomerService: CustomerService,
  ) {}

  @Post('createProduct')
  @UseInterceptors(FileInterceptor('PRODUCT_LOGO_IMAGE'))
  @UsePipes(new ValidationPipe())
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productInfo: createProductDTO,
  ) {
    let PRODUCT_LOGO_IMAGE = '/';
    if (file != undefined) {
      let frmD = new FormData();
      const blob = new Blob([file.buffer]);
      frmD.append('PRODUCT_LOGO_IMAGE', blob, file.originalname);
      frmD.append('PRODUCT_NAME', file.originalname);
      PRODUCT_LOGO_IMAGE = file.originalname;
      const uploadImage: Response = await fetch(
        'http://localhost:3000/api/uploadImage',
        {
          method: 'POST',
          body: frmD,
        },
      );
      if (!uploadImage.ok) {
        return { success: false, message: 'server image Error ' };
      }
      if (uploadImage.ok) {
        let uploadImageStatus: { success: boolean } = await uploadImage.json();
        if (!uploadImageStatus.success) {
          return { success: false, message: 'Upload image error' };
        }
      }
    }
    let { PRODUCT_ID } = await this.ProductService.createProduct({
      ...productInfo,
      PRODUCT_LOGO_IMAGE:
        PRODUCT_LOGO_IMAGE != '/' ? '/' + file.originalname : '/',
    });
    return { success: true, message: PRODUCT_ID };
  }

  @Post('updateProduct')
  @UseInterceptors(FileInterceptor('PRODUCT_LOGO_IMAGE'))
  @UsePipes(new ValidationPipe())
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() productInfo: updateProductDTO,
  ) {
    let PRODUCT_LOGO_IMAGE = '/';
    if (file != undefined) {
      PRODUCT_LOGO_IMAGE = file.originalname;
      let frmD = new FormData();
      const blob = new Blob([file.buffer]);
      frmD.append('PRODUCT_LOGO_IMAGE', blob, file.originalname);
      frmD.append('PRODUCT_NAME', file.originalname);
      const uploadImage: Response = await fetch(
        'http://localhost:3000/api/uploadImage',
        {
          method: 'POST',
          body: frmD,
        },
      );
      if (!uploadImage.ok) {
        return { success: false, message: 'server image Error ' };
      }
      if (uploadImage.ok) {
        let uploadImageStatus: { success: boolean } = await uploadImage.json();
        if (!uploadImageStatus.success) {
          return { success: false, message: 'Upload image error' };
        }
      }
    }
    let { PRODUCT_ID } = await this.ProductService.updateProduct({
      ...productInfo,
      PRODUCT_LOGO_IMAGE:
        PRODUCT_LOGO_IMAGE != '/' ? '/' + file.originalname : '/',
    });
    return { success: true, message: PRODUCT_ID };
  }
  @Delete('/deleteProduct')
  async deleteProduct(@Body('ProductId') productId: number) {
    return this.ProductService.deleteProduct(productId);
  }
  @Get('/customer_list')
  async getListCustomer(@Query() query) {
    let searchTerm: string | undefined = query.searchTerm;
    let col:
      | 'LAST_NAME'
      | 'FIRST_NAME'
      | 'CUSTOMER_ID'
      | 'LOGIN_NAME'
      | 'EMAIL_ADDRESS'
      | undefined = query.col;
    return this.CustomerService.getListCustomer(searchTerm, col);
  }
  @Get('/customer')
  async getFulCustomerInfo(@Query('customer_id') customer_id: number) {
    return this.CustomerService.getFullCustomerInformation(customer_id);
  }
  @Delete('/customer')
  async deleteCustomer(@Body('customer_id') customer_id) {
    return this.CustomerService.deleteCustomer(customer_id);
  }
  @Post('/customer')
  @UseInterceptors(FileInterceptor('AVATAR'))
  @UsePipes(new ValidationPipe())
  async updateCustomer(
    @Body() bd: updateCustomerDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let AVATAR = '/';
    if (file != undefined) {
      AVATAR += file.originalname;
      let frmD = new FormData();
      const blob = new Blob([file.buffer]);
      frmD.append('PRODUCT_LOGO_IMAGE', blob, file.originalname);
      frmD.append('PRODUCT_NAME', file.originalname);
      const uploadImage: Response = await fetch(
        'http://localhost:3000/api/uploadImage',
        {
          method: 'POST',
          body: frmD,
        },
      );
      if (!uploadImage.ok) {
        return { success: false, message: 'server image Error ' };
      }
      if (uploadImage.ok) {
        let uploadImageStatus: { success: boolean } = await uploadImage.json();
        if (!uploadImageStatus.success) {
          return { success: false, message: 'Upload image error' };
        }
      }
    }
    let { CUSTOMER_ID } = await this.CustomerService.updateCustomer({
      ...bd,
      AVATAR: AVATAR,
    });
    return { success: true, message: CUSTOMER_ID };
  }
  @Post('/addCustomer')
  @UseInterceptors(FileInterceptor('AVATAR'))
  @UsePipes(new ValidationPipe())
  async addCustomer(
    @Body() bd: addCustomerDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let AVATAR = '/';
    if (file != undefined) {
      AVATAR += file.originalname;
      let frmD = new FormData();
      const blob = new Blob([file.buffer]);
      frmD.append('PRODUCT_LOGO_IMAGE', blob, file.originalname);
      frmD.append('PRODUCT_NAME', file.originalname);
      const uploadImage: Response = await fetch(
        'http://localhost:3000/api/uploadImage',
        {
          method: 'POST',
          body: frmD,
        },
      );
      if (!uploadImage.ok) {
        return { success: false, message: 'server image Error ' };
      }
      if (uploadImage.ok) {
        let uploadImageStatus: { success: boolean } = await uploadImage.json();
        if (!uploadImageStatus.success) {
          return { success: false, message: 'Upload image error' };
        }
      }
    }
    let { CUSTOMER_ID } = await this.CustomerService.addCustomer({
      ...bd,
      AVATAR: AVATAR,
    });
    return { success: true, message: CUSTOMER_ID };
  }
}
