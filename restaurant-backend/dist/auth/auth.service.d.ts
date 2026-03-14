import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/users/user.entity';
import { OtpCode } from 'src/otp/otp.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { MailService } from 'src/mail/mail.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly mailService;
    private readonly otpRepository;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService, otpRepository: Repository<OtpCode>);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: UserRole;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: UserRole;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
