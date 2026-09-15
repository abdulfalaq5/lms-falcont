import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async issueTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'change_me_access_secret'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'change_me_refresh_secret'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }

  // Self-register: akun langsung dibuat dengan role `user`, email verification disederhanakan
  // (dalam produksi kirim link/OTP lewat SMTP/mailhog, di sini token diberikan langsung di respons).
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.USER,
      status: 'active',
    });

    const tokens = await this.issueTokens({ id: user.id, email: user.email, role: user.role });
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email atau password salah');
    if (user.status !== 'active') throw new UnauthorizedException('Akun belum aktif');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Email atau password salah');

    const tokens = await this.issueTokens(user);
    const { password_hash, deleted_at, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'change_me_refresh_secret'),
      });
      const user = await this.usersService.findById(payload.sub);
      return this.issueTokens(user);
    } catch {
      throw new BadRequestException('Refresh token tidak valid atau kedaluwarsa');
    }
  }
}
