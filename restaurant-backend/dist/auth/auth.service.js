"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const otp_entity_1 = require("../otp/otp.entity");
const typeorm_2 = require("typeorm");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService, otpRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.otpRepository = otpRepository;
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        console.log("LOGIN DTO:", dto);
        if (!user) {
            console.log("=> LỖI: Không tìm thấy Email này trong DB");
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        console.log("USER TRONG DB:", user.email);
        console.log("PASS TRONG DB (Mã hash):", user.password);
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
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
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.BadRequestException('Email đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            fullName: dto.fullName,
            password: hashedPassword,
            role: user_entity_1.UserRole.CUSTOMER,
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
    async forgotPassword(email) {
        console.log("EMAIL RECEIVED:", email);
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email không tồn tại');
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
    async verifyOtp(email, otp) {
        const record = await this.otpRepository.findOne({
            where: { email, otp },
            order: { createdAt: 'DESC' }
        });
        if (!record) {
            throw new common_1.UnauthorizedException('OTP không đúng');
        }
        if (record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('OTP đã hết hạn');
        }
        return {
            message: 'OTP hợp lệ'
        };
    }
    async resetPassword(dto) {
        const { email, otp, newPassword } = dto;
        const record = await this.otpRepository.findOne({
            where: { email, otp },
            order: { createdAt: 'DESC' }
        });
        if (!record) {
            throw new common_1.UnauthorizedException('OTP không đúng');
        }
        if (record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('OTP đã hết hạn');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(email, hashed);
        await this.otpRepository.delete({ email });
        return {
            message: 'Đặt lại mật khẩu thành công'
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(otp_entity_1.OtpCode)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map