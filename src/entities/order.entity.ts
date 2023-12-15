import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CUSTOMER } from './customer.entity';
import { ORDER_STATUS } from './orderStatus.entity';
import { ORDER_LIST_PRODUCT } from './orderListProduct';

@Entity({ name: 'ORDERS' })
export class ORDER {
  @PrimaryGeneratedColumn()
  ORDER_ID: number;

  @Column()
  CUSTOMER_ID: number;

  @Column()
  ORDER_STATUS: number;

  @Column()
  ORDER_ADDRESS: string;

  @Column()
  PAYMENT_ID: number;

  @Column()
  ORDER_DATE: Date;

  @Column()
  IS_DELETED: 0 | 1;

  @ManyToOne((type) => CUSTOMER, (o) => o.orders)
  @JoinColumn({ name: 'CUSTOMER_ID', referencedColumnName: 'CUSTOMER_ID' })
  customer: CUSTOMER;

  @OneToMany((type) => ORDER_LIST_PRODUCT, (o) => o.order)
  @JoinColumn({ name: 'ORDER_ID', referencedColumnName: 'ORDER_ID' })
  order_list_product: ORDER_LIST_PRODUCT[];

  @ManyToOne((type) => ORDER_STATUS, (o) => o.order)
  @JoinColumn({ name: 'ORDER_STATUS', referencedColumnName: 'ORDER_STATUS' })
  order_status: ORDER_STATUS;
}
