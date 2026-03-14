import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';

class AppInputDecoration {
  static InputDecoration build({
    required String hint,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: AppColors.hinttext),
      filled: true,
      fillColor: Color.fromARGB(55, 100, 94, 94),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          width: 1,
          color: Colors.white
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(
          color: AppColors.general,
          width: 1.5,
        ),
      ),
      suffixIcon: suffixIcon,
    );
  }
}