import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { VerifyOtpDto } from './dto/verify_otp.dto';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
