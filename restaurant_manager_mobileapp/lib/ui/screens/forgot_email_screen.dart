import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/auth_service.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/login_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_glass_layout.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_inputdecoration.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_primary_button.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showSnackbar.dart';
import 'verify_otp_screen.dart';

class ForgotEmailScreen extends StatefulWidget {
  const ForgotEmailScreen({super.key});

  @override
  State<ForgotEmailScreen> createState() => _ForgotEmailScreenState();
}

class _ForgotEmailScreenState extends State<ForgotEmailScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isLoading = false;

  void _sendOTP() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final email = _emailController.text.trim();

      final success = await AuthService.forgotPassword(email);

      if (!mounted) return;

      if (!success) {
        AppShowsnackbar().showCustomSnackBar("Email not found", false, context);
        return;
      }

      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => VerifyOTPScreen(email: email)),
      );
    } catch (e) {
      AppShowsnackbar().showCustomSnackBar("Error: ${e.toString()}", false, context);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassAuthLayout(
      title: "Forgot Password",
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            const Text(
              "Enter your email to receive OTP",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 25),
            TextFormField(
              controller: _emailController,
              style: TextStyle(color: Colors.white),
              decoration: AppInputDecoration.build(hint: "Email"),
              validator: (value) =>
                  value == null || value.isEmpty ? "Enter email" : null,
            ),
            const SizedBox(height: 25),
            AppPrimaryButton(
              text: "Send OTP",
              isLoading: _isLoading,
              onPressed: _sendOTP,
            ),
            const SizedBox(height: 20),

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
      ),
    );
  }
}
