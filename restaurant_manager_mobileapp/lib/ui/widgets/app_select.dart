import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';

class AppSelect<T> extends StatelessWidget {
  final T? initialValue;
  final String hint;
  final List<DropdownMenuEntry<T>> items;
  final ValueChanged<T?> onChanged;
  final IconData? prefixIcon;

  const AppSelect({
    super.key,
    required this.items,
    required this.onChanged,
    this.initialValue,
    this.hint = "Select",
    this.prefixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownMenu<T>(
      width: double.infinity,
      initialSelection: initialValue,
      hintText: hint,
      leadingIcon: prefixIcon != null ? Icon(prefixIcon, size: 20) : null,
      onSelected: onChanged,

      /// Style dropdown menu
      menuStyle: MenuStyle(
        elevation: const WidgetStatePropertyAll(6),
        backgroundColor: const WidgetStatePropertyAll(AppColors.background),
        shape: WidgetStatePropertyAll(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        padding: const WidgetStatePropertyAll(
          EdgeInsets.symmetric(vertical: 2),
        ),
      ),

      /// Style select
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.conprofile,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: Colors.black,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(
            color: Colors.black.withValues(alpha: 0.3),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(
            color: Colors.orange,
            width: 1.5,
          ),
        ),
      ),

      dropdownMenuEntries: items,
    );
  }
}