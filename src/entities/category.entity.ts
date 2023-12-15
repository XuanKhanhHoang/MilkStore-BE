import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'CATEGORIES' })
export class CATEGORY {
  @PrimaryGeneratedColumn()
  CATEGORY_ID: number;

  @Column()
  CATEGORY_NAME: string;

  @Column()
  IS_DELETED: 0 | 1;
}
