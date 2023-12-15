import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CUSTOMER } from 'src/entities/customer.entity';

@Injectable()
export class AdminService {
  constructor() {}
}
