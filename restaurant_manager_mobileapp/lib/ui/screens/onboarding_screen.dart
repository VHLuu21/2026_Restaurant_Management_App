import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/login_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_indicator.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreen();
}

class _OnboardingScreen extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _pages = [
    {
      "image": "assets/imgs/onboardcus.jpg",
      "title": "Culinary Masterpiece",
      "subtitle": "Explore premium flavors & unique dishes.",
    },
    {
      "image": "assets/imgs/onboardcus2.jpg",
      "title": "Easy booking at a touch",
      "subtitle": "Choose your preferred spot and secure your table",
    },
    {
      "image": "assets/imgs/onboardcus3.jpg",
      "title": "Dining, Simplified",
      "subtitle":
          "Secure your favorite table and explore the menu before you arrive",
    },
  ];

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.pushReplacement(
        context,
        AppRoute.slideFade(const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: _pages.length,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemBuilder: (context, index) {
              return Stack(
                children: [
                  Container(
                    width: double.infinity,
                    height: double.infinity,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage(_pages[index]["image"]!),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Container(color: Colors.black.withValues(alpha: 0.5)),
                  SafeArea(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 70),
                        Image.asset("assets/imgs/logo2.png", width: 140),
                        const Spacer(),
                        SizedBox(
                          width: double.infinity,
                          child: Text(
                            _pages[index]["title"]!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: AppFonts.lobster,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: AppColors.text,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 25),
                          child: SizedBox(
                            width: double.infinity,
                            child: Text(
                              _pages[index]["subtitle"]!,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontFamily: AppFonts.roboto,
                                fontSize: 17,
                                color: Colors.white.withValues(alpha: 0.8),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 155),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),

          /// Skip button
          Positioned(
            top: 40,
            right: 20,
            child: TextButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  AppRoute.slideFade(const LoginScreen())
                );
              },
              style: TextButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: 0.2),
                side: BorderSide(width: 1, color: AppColors.general),
              ),
              child: const Text(
                "Skip",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontFamily: AppFonts.roboto,
                ),
              ),
            ),
          ),

          /// Bottom button
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AppIndicator(
                  currentIndex: _currentPage,
                  totalPages: _pages.length,
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _nextPage,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.general,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      _currentPage == _pages.length - 1 ? "Start" : "Next",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        fontFamily: AppFonts.roboto,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
