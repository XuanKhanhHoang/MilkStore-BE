import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginInfoDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
