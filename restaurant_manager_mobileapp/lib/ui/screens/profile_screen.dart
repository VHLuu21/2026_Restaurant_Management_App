import 'package:dotted_line/dotted_line.dart';
import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/models/option_item.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/edit_profile_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/login_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_option_picker.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showdialog.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String name = "";
  String email = "";
  String language = "en";
  double size = 16;

  Future<void> _gotoEdit() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) =>
            EditProfileScreen(currentName: name, currentEmail: email),
      ),
    );

    if (result != null) {
      setState(() {
        name = result["name"];
        email = result["email"];
      });
    }
  }

  // Display select language screen
  Future<void> _chooseLanguage() async {
    final result = await showOptionPicker<String>(
      context: context,
      selectedValue: language,
      options: [
        OptionItem(label: "English", value: "en"),
        OptionItem(label: "Tiếng Việt", value: "vi"),
      ],
    );

    if (result != null) {
      setState(() => language = result);
    }
  }

  // Display select size screen
  Future<void> _chooseSize() async {
    final result = await showOptionPicker<double>(
      context: context,
      selectedValue: size,
      options: [
        OptionItem(label: "Small", value: 14),
        OptionItem(label: "Medium", value: 16),
        OptionItem(label: "Large", value: 18),
      ],
    );

    if (result != null) {
      setState(() => size = result);
    }
  }

  /// Logout
  void logout() async {
    final ok = await showConfirmDialog(
      context,
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Log out",
      cancelText: "Cancel",
      icon: Icons.logout_rounded,
      confirmColor: AppColors.primary,
    );

    if (ok == true) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      Navigator.pushAndRemoveUntil(
        context,
        AppRoute.slideFade(const LoginScreen()),
        (route) => false,
      );
    }
  }

  void _loadUserData() async {
    // Load user data from SharedPreferences
    final prefs = await SharedPreferences.getInstance();

    if (!mounted) return;
    setState(() {
      name = prefs.getString("fullName") ?? "";
      email = prefs.getString("email") ?? "";
    });
  }

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(title: "My Profile"),
      body: Padding(
        padding: EdgeInsets.only(top: 20, left: 10, right: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: 90,
              decoration: BoxDecoration(
                color: AppColors.conprofile,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: EdgeInsets.only(left: 10),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadiusGeometry.circular(15),
                          child: Image.asset(
                            "assets/imgs/test/avatar.png",
                            width: 70,
                            height: 70,
                            fit: BoxFit.cover,
                          ),
                        ),
                        SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Hello, ${name.isNotEmpty ? name : "Guest"} 👋",
                              style: TextStyle(
                                color: Colors.black,
                                fontFamily: AppFonts.roboto,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              email.isNotEmpty ? email : "guest@gmail.com",
                              style: TextStyle(
                                color: Colors.black,
                                fontFamily: AppFonts.poppins,
                                fontSize: 14,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.only(right: 20),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Colors.white70,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: IconButton(
                        onPressed: _gotoEdit,
                        padding: EdgeInsets.zero,
                        iconSize: 18,
                        splashRadius: 20,
                        icon: Icon(Icons.edit, color: Colors.black87),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // General
            const SizedBox(height: 20),
            Padding(
              padding: EdgeInsets.only(left: 1),
              child: Text(
                "General",
                style: TextStyle(
                  fontFamily: AppFonts.roboto,
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 21,
                ),
              ),
            ),
            SizedBox(height: 6),
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.conprofile,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: EdgeInsets.only(left: 10, right: 7, top: 5, bottom: 5),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Language",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            _chooseLanguage();
                          },
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                    const DottedLine(
                      dashColor: Colors.grey,
                      dashGapLength: 4,
                      dashLength: 6,
                      lineThickness: 1.5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Text size",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            _chooseSize();
                          },
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                    const DottedLine(
                      dashColor: Colors.grey,
                      dashGapLength: 4,
                      dashLength: 6,
                      lineThickness: 1.5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Invite friend",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Support
            const SizedBox(height: 20),
            Padding(
              padding: EdgeInsets.only(left: 1),
              child: Text(
                "Support",
                style: TextStyle(
                  fontFamily: AppFonts.roboto,
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 21,
                ),
              ),
            ),

            const SizedBox(height: 6),

            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.conprofile,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Padding(
                padding: EdgeInsets.only(left: 10, right: 7, top: 5, bottom: 5),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Info restaurant",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                    const DottedLine(
                      dashColor: Colors.grey,
                      dashGapLength: 4,
                      dashLength: 6,
                      lineThickness: 1.5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Term & condition",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                    const DottedLine(
                      dashColor: Colors.grey,
                      dashGapLength: 4,
                      dashLength: 6,
                      lineThickness: 1.5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Contact us",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                    const DottedLine(
                      dashColor: Colors.grey,
                      dashGapLength: 4,
                      dashLength: 6,
                      lineThickness: 1.5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "About",
                          style: TextStyle(
                            color: AppColors.textrofile,
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: Icon(Icons.keyboard_arrow_right),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            //Logout button
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  logout();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  elevation: 3,
                ),
                child: Text(
                  "Log out",
                  style: TextStyle(
                    color: Colors.black,
                    fontFamily: AppFonts.poppins,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
