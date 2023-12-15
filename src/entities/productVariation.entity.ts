import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PRODUCT_GENERAL } from './productGeneral';
import { type } from 'os';
import { ORDER_LIST_PRODUCT } from './orderListProduct';

@Entity({ name: 'PRODUCT_VARIATIONS' })
export class PRODUCT_VARIATIONS {
  @PrimaryGeneratedColumn()
  VARIATION_ID: number;

  @Column()
  @ManyToOne((type) => PRODUCT_GENERAL, (production) => production.PRODUCT_ID)
  @JoinColumn({ name: 'PRODUCT_ID' })
  PRODUCT_ID: number;

  @Column()
  PRICE: number;
  @Column()
  UNIT: string;
  @Column()
  AMOUNT: number;

  @ManyToOne(() => PRODUCT_GENERAL)
  @JoinColumn({ name: 'PRODUCT_ID', referencedColumnName: 'PRODUCT_ID' })
  product: PRODUCT_GENERAL;

  @OneToMany((type) => ORDER_LIST_PRODUCT, (v) => v.product_variation)
  @JoinColumn({
    name: 'PRODUCT_VARIATION_ID',
  })
  order_list_product: ORDER_LIST_PRODUCT[];
}
