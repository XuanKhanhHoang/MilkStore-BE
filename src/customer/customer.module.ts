import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER } from 'src/entities/customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ORDER } from 'src/entities/order.entity';
import { ORDER_LIST_PRODUCT } from 'src/entities/orderListProduct';
import { ORDER_STATUS } from 'src/entities/orderStatus.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CUSTOMER,
      ORDER,
      ORDER_LIST_PRODUCT,
      ORDER_STATUS,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [TypeOrmModule, CustomerService],
})
export class CustomerModule {}
