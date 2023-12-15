import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { ValidationPipe } from './validation.pipe';
import { loginInfoDto } from './dto/login.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post('/getInfoByAccessToken')
  GetInfoByAccessToken(@Body('token') token: string) {
    if (token == undefined) throw new BadRequestException();
    return this.authServices.GetInfoByAccessToken(token);
  }
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async HandleLogin(@Body() data: loginInfoDto) {
    return this.authServices.Login(data);
  }
  @Post('/AdminLogin')
  @UsePipes(new ValidationPipe())
  HandleAdminLogin(@Body() data: loginInfoDto) {
    return this.authServices.AdminLogin(data);
  }
}
