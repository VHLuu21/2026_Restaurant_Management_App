import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpCode } from 'src/otp/otp.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,

        @InjectRepository(OtpCode)
        private readonly otpRepository: Repository<OtpCode>,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        console.log("LOGIN DTO:", dto);

        if (!user) {
            console.log("=> LỖI: Không tìm thấy Email này trong DB");
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        console.log("USER TRONG DB:", user.email);
        console.log("PASS TRONG DB (Mã hash):", user.password);
        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);

        if (existing) {
            throw new BadRequestException('Email đã tồn tại');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            fullName: dto.fullName,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
        });

        return {
            message: 'Đăng ký thành công',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }

    async forgotPassword(email: string) {
        console.log("EMAIL RECEIVED:", email);

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Email không tồn tại');
        }

        await this.otpRepository.delete({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);

        await this.otpRepository.save({
            email,
            otp,
            expiresAt: expires,
        });

        await this.mailService.sendOtp(email, otp);

        return {
            message: 'OTP đã được gửi'
        };
    }

    async verifyOtp(email: string, otp: string) {

        const record = await this.otpRepository.findOne({
            where: { email, otp },
            order: { createdAt: 'DESC' }
        });

        if (!record) {
            throw new UnauthorizedException('OTP không đúng');
        }

        if (record.expiresAt < new Date()) {
            throw new UnauthorizedException('OTP đã hết hạn');
        }

        return {
            message: 'OTP hợp lệ'
        };
    }

    async resetPassword(dto: ResetPasswordDto) {

        const { email, otp, newPassword } = dto;

        const record = await this.otpRepository.findOne({
            where: { email, otp },
            order: { createdAt: 'DESC' }
        });

        if (!record) {
            throw new UnauthorizedException('OTP không đúng');
        }

        if (record.expiresAt < new Date()) {
            throw new UnauthorizedException('OTP đã hết hạn');
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.usersService.updatePassword(email, hashed);
        await this.otpRepository.delete({ email });

        return {
            message: 'Đặt lại mật khẩu thành công'
        };
    }
}