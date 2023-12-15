import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { CustomerModule } from 'src/customer/customer.module';
@Module({
  imports: [ProductModule, CustomerModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
