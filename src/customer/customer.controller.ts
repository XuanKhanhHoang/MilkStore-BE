import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private customerServices: CustomerService) {}

  @UseGuards(AuthGuard)
  @Get('/detail')
  // @Roles(Role.Customer)
  getInfoUser(@Request() req) {
    const user: {
      userId: number;
      role: string;
    } = req.user;
    return this.customerServices.getCustomerDetail(user.userId);
  }
}
