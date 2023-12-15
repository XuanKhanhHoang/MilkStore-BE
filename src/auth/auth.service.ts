import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, ILike } from 'typeorm';
import { CUSTOMER } from '../entities/customer.entity';
import { userSummaryInfo } from './dto/user.dto';
import { loginInfoDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtCons } from './jwtConst';
import { adminRole, customerRole } from './roles.enum';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private JwtService: JwtService,
  ) {}
  async GetInfoByAccessToken(token: string): Promise<userSummaryInfo> {
    try {
      const payload: { userId: number; role: string; iat: any; exp: any } =
        await this.JwtService.verifyAsync(token, {
          secret: jwtCons.secret,
        });
      if (payload.exp * 1000 < new Date().getTime())
        throw new UnauthorizedException();
      if (payload.userId != undefined) {
        if (payload.role != adminRole) {
          let user: CUSTOMER = await this.dataSource
            .getRepository(CUSTOMER)
            .findOne({
              where: {
                CUSTOMER_ID: payload.userId,
                IS_DELETED: 0,
              },
            });
          if (!user) throw new UnauthorizedException('Not found');
          return {
            CUSTOMER_ID: user.CUSTOMER_ID,
            FIRST_NAME: user.FIRST_NAME,
            AVATAR: user.AVATAR,
            ROLE: customerRole,
          };
        }
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
  async Login(
    data: loginInfoDto,
  ): Promise<{ access_token: string; value: userSummaryInfo }> {
    let user: CUSTOMER | undefined = await this.dataSource
      .getRepository(CUSTOMER)
      .findOne({
        where: {
          LOGIN_NAME: ILike(data.username.trim()),
          IS_DELETED: 0,
        },
      });
    if (user == undefined) throw new UnauthorizedException();
    let auth = await bcrypt.compare(
      data.password.trim(),
      user.LOGIN_PASSWORD.trim(),
    );
    if (!auth) throw new UnauthorizedException();
    let access_token = await this.JwtService.signAsync({
      userId: user.CUSTOMER_ID,
      role: customerRole,
    });
    return {
      access_token: access_token,
      value: {
        CUSTOMER_ID: user.CUSTOMER_ID,
        FIRST_NAME: user.FIRST_NAME,
        AVATAR: user.AVATAR,
        ROLE: customerRole,
      },
    };
  }
  async Register(): Promise<userSummaryInfo> {
    return;
  }
  async AdminLogin(data: loginInfoDto) {
    let Admin: loginInfoDto = { username: 'Admin', password: 'Khanhpopo1S' };

    if (JSON.stringify(data) != JSON.stringify(Admin))
      throw new UnauthorizedException();
    let access_token = await this.JwtService.signAsync({
      role: customerRole,
    });
    return {
      access_token: access_token,
      value: {
        CUSTOMER_ID: '',
        FIRST_NAME: '',
        AVATAR: '',
        ROLE: adminRole,
      },
    };
  }
}
