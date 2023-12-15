import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CUSTOMER } from './customer.entity';
import { ORDER } from './order.entity';

@Entity({ name: 'ORDERSSTATUS' })
export class ORDER_STATUS {
  @PrimaryGeneratedColumn()
  ORDER_STATUS: number;
  @Column()
  STATUS_NAME: string;
  @OneToMany(() => ORDER, (o) => o.order_status)
  @JoinColumn({ name: 'ORDER_STATUS' })
  order: ORDER[];
}
