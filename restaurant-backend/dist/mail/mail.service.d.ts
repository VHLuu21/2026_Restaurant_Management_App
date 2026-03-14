export declare class MailService {
    private transporter;
    sendOtp(email: string, otp: string): Promise<void>;
}
