import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/main_route_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class AppCompleteWidget extends StatelessWidget {
  final String title;
  final String message;
  final String question;

  final String primaryText;
  final VoidCallback onPrimaryPressed;

  const AppCompleteWidget({
    super.key,
    required this.title,
    required this.message,
    required this.question,
    required this.primaryText,
    required this.onPrimaryPressed,
  });

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        // Prevent back navigation
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),

            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.check_circle_outline,
                  color: Colors.green,
                  size: 100,
                ),

                const SizedBox(height: 20),

                /// Title complete
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontFamily: AppFonts.roboto,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                /// Message complete
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    fontFamily: AppFonts.montserrat,
                  ),
                ),

                const SizedBox(height: 30),

                /// Question
                Text(
                  question,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 18,
                    fontFamily: AppFonts.poppins,
                    fontWeight: FontWeight.w500,
                  ),
                ),

                const SizedBox(height: 50),

                /// Primary button
                ElevatedButton(
                  onPressed: onPrimaryPressed,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 40,
                      vertical: 15,
                    ),
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    primaryText,
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                      fontFamily: AppFonts.roboto,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),

                const SizedBox(height: 15),

                /// Secondary button (fixed)
                TextButton.icon(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      AppRoute.slideFade(MainRouteScreen()),
                      (route) => false,
                    );
                  },
                  icon: Icon(
                    Icons.arrow_back,
                    size: 18,
                    color: Colors.grey.shade700,
                  ),
                  label: Text(
                    "Back to Home",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade700,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 10,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
