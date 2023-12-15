import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class updateCustomerDTO {
  @IsNotEmpty()
  CUSTOMER_ID: number;
  AVATAR: any;
  GENDER: 'M' | 'F';
  @IsNotEmpty()
  FIRST_NAME: string;
  @IsNotEmpty()
  LAST_NAME: string;
  @IsNotEmpty()
  @IsEmail()
  EMAIL_ADDRESS: string;
  @IsNotEmpty()
  LOGIN_NAME: string;
  @IsNotEmpty()
  PHONE_NUMBER: string;
  @IsNotEmpty()
  ADDRESS: string;
  PASSWORD: string | '';
}
