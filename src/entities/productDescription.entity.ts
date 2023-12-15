import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PRODUCT_GENERAL } from './productGeneral';

@Entity({ name: 'PRODUCT_DESCRIPTION' })
export class PRODUCT_DESCRIPTION {
  @PrimaryColumn()
  @OneToOne(() => PRODUCT_GENERAL, (production) => production.PRODUCT_ID)
  @JoinColumn({ name: 'PRODUCT_ID' })
  PRODUCT_ID: number;

  @Column()
  PRODUCT_DESCRIPTION: string;
}
