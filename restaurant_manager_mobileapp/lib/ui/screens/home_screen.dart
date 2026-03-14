import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/test_data/food.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_category_titlte.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_chef.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_deal.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_food_horizonlist.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_promo_banner.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_searchbar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_slider_brand.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_slider_food.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String name = "";
  String email = "";

  void loadUserData() async {
    // Load user data from SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      name = prefs.getString("fullName") ?? "";
      email = prefs.getString("email") ?? "";
    });
  }

  @override
  void initState() {
    super.initState();
    loadUserData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.only(),
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.only(top: 10, left: 15, right: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Padding(
                        padding: EdgeInsets.only(),
                        child: Image.asset('assets/imgs/logo2.png', width: 50),
                      ),
                      Text(
                        "Hello, ${name.isNotEmpty ? name : "Guest"}",
                        style: TextStyle(
                          color: Colors.black,
                          fontFamily: AppFonts.lobster,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 5),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: AppSearchBar(
                    rotatingHints: [
                      "Search dishes",
                      "Try: Pizza",
                      "Try: Milk tea",
                      "Try: Fried chicken",
                    ],
                    onChanged: (value) {
                      print(value);
                    },
                  ),
                ),

                const SizedBox(height: 15),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: BrandSlider(),
                ),

                const SizedBox(height: 15),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: AppCategoryTitlte(category: "Popular dish"),
                ),
                FoodHorizontalList(items: FoodData.foods),

                const SizedBox(height: 20),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: PromoBanner(
                    onTap: () {
                      Navigator.push(context, AppRoute.slideFade(MenuScreen()));
                    },
                  ),
                ),
                const SizedBox(height: 20),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: AppCategoryTitlte(category: "Hot deals"),
                ),
                AppDeal(),

                const SizedBox(height: 20),
                Padding(
                  padding: EdgeInsets.only(left: 15, right: 15),
                  child: Column(
                    children: [
                      AppCategoryTitlte(category: "International Cuisine"),
                      FoodSlider(),
                    ],
                  ),
                ),

                const SizedBox(height: 30),
                Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Our Master Chefs",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.black87,
                          fontFamily: AppFonts.lobstertwo,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 60,
                        height: 3,
                        decoration: BoxDecoration(
                          color: AppColors.general,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 15),
                AppChef(),
                SizedBox(height: 50),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
