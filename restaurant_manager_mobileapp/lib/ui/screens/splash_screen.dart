import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          Image.asset("assets/imgs/backgound_splash.jpg"),
          Container(color: Colors.black.withValues(alpha: 0.8)),
          Center(
            child: Padding(
              padding: EdgeInsets.only(top: 170),
              child: Column(
                children: [
                  Image.asset("assets/imgs/logo.png", width: 130),
                  Text(
                    "RestMan",
                    style: TextStyle(
                      fontFamily: AppFonts.lobster,
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary.withValues(alpha: 0.8),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: EdgeInsets.only(bottom: 40, left: 10, right: 10),
              child: Text(
                "Smart Management, Dedicated Service",
                style: TextStyle(
                  fontFamily: AppFonts.lobster,
                  fontWeight: FontWeight.w400,
                  fontSize: 14,
                  color: const Color.fromARGB(255, 99, 99, 99),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
