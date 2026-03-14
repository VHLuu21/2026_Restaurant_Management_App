import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/auth_service.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/login_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/reset_pasword_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_glass_layout.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_otp_field.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_primary_button.dart';

class VerifyOTPScreen extends StatefulWidget {
  final String email;
  const VerifyOTPScreen({super.key, required this.email});

  @override
  State<VerifyOTPScreen> createState() => _VerifyOTPScreenState();
}

class _VerifyOTPScreenState extends State<VerifyOTPScreen> {
  bool _isLoading = false;
  String _currentOtp = "";

  void _verifyOTP(String otp) async {
    otp = otp.trim();
  if (otp.length < 6) return;

  setState(() => _isLoading = true);

  try {
    final isValid = await AuthService.verifyOTP(widget.email, otp);

    if (!mounted) return;

    if (isValid) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => ResetPasswordScreen(
            email: widget.email,
            otp: otp,
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Invalid or expired OTP")),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Connection error")),
    );
  } finally {
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }
}

  @override
  Widget build(BuildContext context) {
    return GlassAuthLayout(
      title: "Verify OTP",
      child: Column(
        children: [
          Text(
            "OTP sent to ${widget.email}",
            style: const TextStyle(color: Colors.white70),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 25),

          /// OTP field
          AppOtpField(
            length: 6,
            onCompleted: (otp) {
              _currentOtp = otp;
            },
          ),

          const SizedBox(height: 25),

          /// Verify button
          AppPrimaryButton(
            text: "Verify",
            isLoading: _isLoading,
            onPressed: () {
              if (_currentOtp.length == 6) {
                _verifyOTP(_currentOtp);
              }
            },
          ),

          const SizedBox(height: 20),
          //Return Login screen
          GestureDetector(
            onTap: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (route) => false,
              );
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.arrow_back, color: Colors.white70, size: 18),
                SizedBox(width: 6),
                Text(
                  "Back to Login",
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
