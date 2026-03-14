import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';

class AppCategoryTitlte extends StatelessWidget {
  final String category;
  const AppCategoryTitlte({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 4,
                height: 23,
                decoration: BoxDecoration(
                  color: AppColors.general,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                category,
                style: TextStyle(
                  color: Colors.black,
                  fontFamily: AppFonts.lobstertwo,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          Text(
            "View all >",
            style: TextStyle(
              color: AppColors.hinttext,
              fontFamily: AppFonts.lobstertwo,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
