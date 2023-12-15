import { Dependencies, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { DataSource } from 'typeorm';
import { CATEGORY } from './entities/category.entity';
import { PRODUCT_GENERAL } from './entities/productGeneral';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
@Dependencies(DataSource)
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: `"KTH_MILKSTORE_REMOTE_WEB"`,
      password: 'Khanhpopo1S',
      // synchronize: false,
      entities: [CATEGORY, PRODUCT_GENERAL],
      serviceName: 'orcl',
      autoLoadEntities: true,
      schema: 'KTH_MILKSTORE_ADMIN',
      // logging: true,
    }),
    ProductModule,
    AuthModule,
    AdminModule,
    CustomerModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }
}
