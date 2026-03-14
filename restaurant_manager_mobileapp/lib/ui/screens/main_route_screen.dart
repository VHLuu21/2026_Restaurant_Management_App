import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/favorites_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/home_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/profile_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/reserve_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_bottom_navigation.dart';

class MainRouteScreen extends StatefulWidget {
  const MainRouteScreen({super.key});

  @override
  State<MainRouteScreen> createState() => _MainRouteScreenState();
}

class _MainRouteScreenState extends State<MainRouteScreen> {
  int _currentIndex = 0;

  final List<Widget> _screen = const [
    HomeScreen(),
    MenuScreen(),
    ReserveScreen(),
    FavoritesScreen(),
    ProfileScreen(),
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      backgroundColor: Colors.transparent,
      body: _screen[_currentIndex],
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
