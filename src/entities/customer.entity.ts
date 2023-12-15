import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ORDER } from './order.entity';

@Entity({ name: 'CUSTOMERS' })
export class CUSTOMER {
  @PrimaryGeneratedColumn()
  CUSTOMER_ID: number;

  @Column()
  GENDER: string;

  @Column()
  FIRST_NAME: string;

  @Column()
  LAST_NAME: string;

  @Column()
  EMAIL_ADDRESS: string;

  @Column()
  LOGIN_NAME: string;

  @Column()
  LOGIN_PASSWORD: string;

  @Column()
  PHONE_NUMBER: string;

  @Column()
  ADDRESS: string;

  @Column()
  AVATAR: string;

  @Column()
  IS_DELETED: 0 | 1;

  @OneToMany((type) => ORDER, (c) => c.customer, {
    cascade: true,
  })
  @JoinColumn({ name: 'CUSTOMER_ID', referencedColumnName: 'CUSTOMER_ID' })
  orders?: ORDER[];
}
