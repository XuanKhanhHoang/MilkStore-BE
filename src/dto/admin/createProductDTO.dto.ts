import { IsNotEmpty } from 'class-validator';

export class createProductDTO {
  @IsNotEmpty()
  PRODUCT_NAME: string;
  PRODUCT_LOGO_IMAGE: string | null;
  PRODUCT_ID: string;
  PRODUCT_DESCRIPTION: string;
  @IsNotEmpty()
  product_variation: string;
  @IsNotEmpty()
  categories: string;
}
