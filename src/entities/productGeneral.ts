import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { CATEGORY } from './category.entity';
import { PRODUCT_VARIATIONS } from './productVariation.entity';
import { PRODUCT_DESCRIPTION } from './productDescription.entity';

@Entity({ name: 'PRODUCTS' })
export class PRODUCT_GENERAL {
  @PrimaryGeneratedColumn()
  PRODUCT_ID: number;

  @Column()
  PRODUCT_NAME: string;

  @Column()
  PRODUCT_LOGO_IMAGE: string;

  @Column()
  IS_DELETED: 0 | 1;

  @ManyToMany(() => CATEGORY)
  @JoinTable({
    name: 'PRODUCT_CATEGORIES',
    joinColumn: {
      name: 'PRODUCT_ID',
      referencedColumnName: 'PRODUCT_ID',
    },
    inverseJoinColumn: {
      name: 'CATEGORY_ID',
      referencedColumnName: 'CATEGORY_ID',
    },
  })
  categories: CATEGORY[];

  @OneToMany((type) => PRODUCT_VARIATIONS, (product) => product.product, {
    cascade: true,
  })
  product_variation: PRODUCT_VARIATIONS[];
  @OneToOne((type) => PRODUCT_DESCRIPTION, (pro) => pro.PRODUCT_ID, {
    cascade: true,
  })
  product_description: PRODUCT_DESCRIPTION;
}
