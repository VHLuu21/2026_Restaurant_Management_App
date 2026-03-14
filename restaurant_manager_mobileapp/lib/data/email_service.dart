import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mailer/mailer.dart';
import 'package:mailer/smtp_server/gmail.dart';

Future<void> emailService({
  required String toEmail,
  required String otpCode,
}) async {
  // Email account information
  final String yourEmail = dotenv.env['EMAIL_ADDRESS'] ?? '';
  final String appPassWord = dotenv.env['EMAIL_APP_PASSWORD'] ?? '';

  final smtpServer = gmail(yourEmail, appPassWord);

  final message = Message()
   ..from = Address(yourEmail, 'RestMan')
   ..recipients.add(toEmail)
   ..subject = 'Your OTP Code'
   ..text = 'Your verification code is: $otpCode'
   ..html = '''
    <h3>Hello</h3>
    <p>Your OTP Code is: <b>$otpCode</b></p>
''';
try {
  await send(message, smtpServer);
} on MailerException catch (e) {
  print('Error: $e');
}

}
