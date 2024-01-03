import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In } from 'typeorm';
import { CUSTOMER } from 'src/entities/customer.entity';
import { ORDER } from 'src/entities/order.entity';
import { updateCustomerDTO } from 'src/dto/customer/updateCustomer.dto';
import * as bcrypt from 'bcrypt';
import { createProductDTO } from 'src/dto/admin/createProductDTO.dto';
import { addCustomerDTO } from 'src/dto/customer/addCustomer.dto';
import { ORDER_LIST_PRODUCT } from 'src/entities/orderListProduct';
import { PRODUCT_VARIATIONS } from 'src/entities/productVariation.entity';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CUSTOMER) private customers: CUSTOMER,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getCustomerDetail(id: number) {
    let configFind: any = {
      where: {
        CUSTOMER_ID: id,
        IS_DELETED: 0,
        orders: {
          IS_DELETED: 0,
        },
      },
      select: {
        CUSTOMER_ID: true,
        FIRST_NAME: true,
        LAST_NAME: true,
        GENDER: true,
        EMAIL_ADDRESS: true,
        LOGIN_NAME: true,
        ADDRESS: true,
        PHONE_NUMBER: true,
        AVATAR: true,
        orders: {
          ORDER_ID: true,
          ORDER_ADDRESS: true,
          PAYMENT_ID: true,
          ORDER_DATE: true,
          order_list_product: {
            ORDER_LIST_ID: true,
            AMOUNT: true,
            PRICE: true,
            product_variation: {
              UNIT: true,
              product: {
                PRODUCT_NAME: true,
              },
            },
          },
          order_status: {
            ORDER_STATUS: true,
            STATUS_NAME: true,
          },
        },
      },
      relations: {
        orders: {
          order_list_product: {
            product_variation: {
              product: true,
            },
          },
          order_status: true,
        },
      },
      order: {
        orders: {
          ORDER_DATE: 'DESC',
        },
      },
    };
    if (
      (
        await this.dataSource.getRepository(CUSTOMER).findOne({
          where: {
            CUSTOMER_ID: id,
            IS_DELETED: 0,
          },
          relations: {
            orders: true,
          },
        })
      ).orders.length == 0
    ) {
      configFind = {
        where: {
          CUSTOMER_ID: id,
          IS_DELETED: 0,
        },
        select: {
          CUSTOMER_ID: true,
          FIRST_NAME: true,
          LAST_NAME: true,
          GENDER: true,
          EMAIL_ADDRESS: true,
          LOGIN_NAME: true,
          ADDRESS: true,
          PHONE_NUMBER: true,
          AVATAR: true,
        },
      };
    }

    let user = await this.dataSource
      .getRepository(CUSTOMER)
      .findOne(configFind);
    let deliveringOrders: any[] = [];
    let otherOrders: any[] = [];
    user?.orders?.map((item) => {
      let PRICE = 0;
      let ORDER_NAME = '';
      const yyyy = item.ORDER_DATE.getFullYear();
      let mm = (item.ORDER_DATE.getMonth() + 1).toString(); // Months start at 0!
      let dd = item.ORDER_DATE.getDate().toString();

      if (Number(dd) < 10) dd = '0' + dd;
      if (Number(mm) < 10) mm = '0' + mm;

      const formattedDate = dd + '/' + mm + '/' + yyyy;
      if (item.order_status.ORDER_STATUS == 1) {
        item.order_list_product.map((pro) => {
          PRICE += pro.PRICE * pro.AMOUNT;
          ORDER_NAME += pro.product_variation.product.PRODUCT_NAME + ',';
        });

        delete item.order_list_product;
        deliveringOrders.push({
          ...item,
          PRICE: PRICE,
          ORDER_NAME,
          ORDER_DATE: formattedDate,
        });
      } else {
        item.order_list_product.map((pro) => {
          PRICE += pro.PRICE * pro.AMOUNT;
          ORDER_NAME += pro.product_variation.product.PRODUCT_NAME + ',';
        });
        delete item.order_list_product;
        otherOrders.push({
          ...item,
          PRICE: PRICE,
          ORDER_NAME,
          ORDER_DATE: formattedDate,
        });
      }
    });
    return {
      ...user,
      orders: {
        deliveringOrders: deliveringOrders,
        otherOrders: otherOrders,
      },
    };
  }
  async getFullCustomerInformation(id: number) {
    let user = await this.dataSource.getRepository(CUSTOMER).findOne({
      where: {
        CUSTOMER_ID: id,
        IS_DELETED: 0,
      },
    });
    return user;
  }
  async getListCustomer(
    searchTerm: string | undefined,
    col:
      | 'LAST_NAME'
      | 'FIRST_NAME'
      | 'CUSTOMER_ID'
      | 'LOGIN_NAME'
      | 'EMAIL_ADDRESS'
      | undefined,
  ) {
    let users;
    if (searchTerm != undefined && col != undefined) {
      users = await this.dataSource.getRepository(CUSTOMER).find({
        where: {
          IS_DELETED: 0,
          [col]: ILike(`%${searchTerm}%`),
        },
      });
    } else {
      users = await this.dataSource.getRepository(CUSTOMER).find({
        where: {
          IS_DELETED: 0,
        },
      });
    }
    return users;
  }
  async updateCustomer(
    customer: updateCustomerDTO,
  ): Promise<{ CUSTOMER_ID: number }> {
    delete customer.PASSWORD;
    let res = await this.dataSource.getRepository(CUSTOMER).findOne({
      where: {
        CUSTOMER_ID: customer.CUSTOMER_ID,
      },
    });
    if (customer.AVATAR == '/') customer.AVATAR = res.AVATAR;
    if (customer.PASSWORD == undefined || customer.PASSWORD.length == 0)
      customer.PASSWORD = res.LOGIN_PASSWORD;
    else customer.PASSWORD = bcrypt.hashSync(customer.PASSWORD, 10);
    res = {
      ...res,
      LOGIN_NAME: customer.LOGIN_NAME,
      EMAIL_ADDRESS: customer.EMAIL_ADDRESS,
      FIRST_NAME: customer.FIRST_NAME,
      GENDER: customer.GENDER,
      ADDRESS: customer.ADDRESS,
      AVATAR: customer.AVATAR,
      LAST_NAME: customer.LAST_NAME,
      PHONE_NUMBER: customer.PHONE_NUMBER,
      LOGIN_PASSWORD: customer.PASSWORD,
    };
    let { CUSTOMER_ID } = await this.dataSource
      .getRepository(CUSTOMER)
      .save(res);
    return { CUSTOMER_ID: CUSTOMER_ID };
  }
  async addCustomer(
    customer: addCustomerDTO,
  ): Promise<{ CUSTOMER_ID: number }> {
    customer.PASSWORD = bcrypt.hashSync(customer.PASSWORD, 10);
    let res = this.dataSource.getRepository(CUSTOMER).create({
      LOGIN_NAME: customer.LOGIN_NAME,
      EMAIL_ADDRESS: customer.EMAIL_ADDRESS,
      FIRST_NAME: customer.FIRST_NAME,
      GENDER: customer.GENDER,
      ADDRESS: customer.ADDRESS,
      AVATAR: customer.AVATAR,
      LAST_NAME: customer.LAST_NAME,
      PHONE_NUMBER: customer.PHONE_NUMBER,
      LOGIN_PASSWORD: customer.PASSWORD,
    });
    let { CUSTOMER_ID } = await this.dataSource
      .getRepository(CUSTOMER)
      .save(res);
    return { CUSTOMER_ID: CUSTOMER_ID };
  }
  async deleteCustomer(id: number) {
    let user = await this.dataSource.getRepository(CUSTOMER).preload({
      CUSTOMER_ID: id,
      IS_DELETED: 1,
    });
    let res = await this.dataSource.getRepository(CUSTOMER).save(user);
    return res.IS_DELETED;
  }
  async createAnOrder(
    cart: cartItem[],
    CUSTOMER_ID: number,
    ORDER_ADDRESS: string | undefined,
    PAYMENT_ID: number | undefined,
  ) {
    if (cart.length == 0) throw new BadRequestException("cart can't empty");
    return await this.dataSource.transaction(async (dataSrc) => {
      cart = cart.sort((a, b) => a.vid - b.vid);
      let vidArr: number[] = cart.map((item) => item.vid);
      let variations = await dataSrc
        .getRepository(PRODUCT_VARIATIONS)
        .findAndCountBy({
          VARIATION_ID: In(vidArr),
        });
      if (variations[1] != vidArr.length)
        throw new BadRequestException('an variation is not exist');
      if (!PAYMENT_ID) PAYMENT_ID = 1;
      if (ORDER_ADDRESS == undefined)
        ORDER_ADDRESS =
          (
            await dataSrc.getRepository(CUSTOMER).findOne({
              where: {
                CUSTOMER_ID: CUSTOMER_ID,
              },
            })
          ).ADDRESS || '';
      let ORDER_ID = (
        await dataSrc.getRepository(ORDER).save({
          CUSTOMER_ID: CUSTOMER_ID,
          ORDER_ADDRESS: ORDER_ADDRESS,
          ORDER_DATE: new Date(),
          ORDER_STATUS: 1,
          PAYMENT_ID: PAYMENT_ID,
        })
      ).ORDER_ID;
      cart.map((item, i) => {
        dataSrc.getRepository(ORDER_LIST_PRODUCT).save({
          PRODUCT_VARIATION_ID: cart[i].vid,
          AMOUNT: cart[i].amount,
          ORDER_ID: ORDER_ID,
          PRICE: cart[i].amount * variations[0][i].PRICE,
        });
      });
    });
  }
}
