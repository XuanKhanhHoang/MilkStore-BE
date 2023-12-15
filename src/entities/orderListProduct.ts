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
import { PRODUCT_VARIATIONS } from './productVariation.entity';
import { ORDER } from './order.entity';

@Entity({ name: 'ORDER_LIST_PRODUCT' })
export class ORDER_LIST_PRODUCT {
  @PrimaryGeneratedColumn()
  ORDER_LIST_ID: number;

  @Column()
  ORDER_ID: number;

  @Column()
  PRODUCT_VARIATION_ID: number;

  @Column()
  AMOUNT: number;

  @Column()
  PRICE: number;

  @ManyToOne((type) => PRODUCT_VARIATIONS, (v) => v.order_list_product)
  @JoinColumn({
    name: 'PRODUCT_VARIATION_ID',
    referencedColumnName: 'VARIATION_ID',
  })
  product_variation: PRODUCT_VARIATIONS;

  @ManyToOne((type) => ORDER, (v) => v.order_list_product)
  @JoinColumn({
    name: 'ORDER_ID',
    referencedColumnName: 'ORDER_ID',
  })
  order: ORDER;
}
