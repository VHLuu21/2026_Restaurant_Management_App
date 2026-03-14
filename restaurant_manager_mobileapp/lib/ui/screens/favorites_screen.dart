import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';

class FavoritesScreen extends StatelessWidget{
  const FavoritesScreen ({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(title: "Favorites"),
      body: const Center(
        child: Text("Your favorite items will appear here."),
      ),
    );
  }
}