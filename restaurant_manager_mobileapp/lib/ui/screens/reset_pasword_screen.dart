import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/auth_service.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/login_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_glass_layout.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_inputdecoration.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_primary_button.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;
  final String otp;
  const ResetPasswordScreen({
    super.key,
    required this.email,
    required this.otp,
  });

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  final bool _obscure = true;
  bool _isLoading = false;

  void _resetPassword() async {
    final password = _passwordController.text.trim();
    final confirm = _confirmController.text.trim();

    if (password.isEmpty || confirm.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Please fill all fields")));
      return;
    }

    if (password != confirm) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Passwords do not match")));
      return;
    }

    if (password.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Password must be at least 6 characters")),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final success = await AuthService.updatePassword(
        widget.email,
        widget.otp,
        password,
      );

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Password updated successfully")),
        );

        Navigator.pushAndRemoveUntil(
          context,
          AppRoute.slideFade(const LoginScreen()),
          (route) => false,
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Failed to update password")),
        );
      }
    } catch (e) {
      print("RESET ERROR: $e");
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return GlassAuthLayout(
      title: "Reset Password",
      child: Column(
        children: [
          TextFormField(
            controller: _passwordController,
            obscureText: _obscure,
            style: TextStyle(color: Colors.white),
            decoration: AppInputDecoration.build(hint: "New Password"),
          ),
          const SizedBox(height: 15),
          TextFormField(
            controller: _confirmController,
            obscureText: _obscure,
            style: TextStyle(color: Colors.white),
            decoration: AppInputDecoration.build(hint: "Confirm Password"),
          ),
          const SizedBox(height: 25),
          AppPrimaryButton(
            text: "Reset Password",
            isLoading: _isLoading,
            onPressed: _resetPassword,
          ),
        ],
      ),
    );
  }
}
