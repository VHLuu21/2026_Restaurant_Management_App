import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_chef_card.dart';

class AppChef extends StatelessWidget {
  const AppChef({super.key});

  @override
  Widget build(BuildContext context) {
    final chefs = [
      {
        "image": "assets/imgs/test/chef1.png",
        "name": "Chef Gordon",
        "exp": "12 EXP",
      },
      {
        "image": "assets/imgs/test/chef2.png",
        "name": "Chef Anna",
        "exp": "12 EXP",
      },
      {
        "image": "assets/imgs/test/chef3.png",
        "name": "Chef John",
        "exp": "12 EXP",
      },
    ];

    return SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: chefs.length,
        itemBuilder: (context, index) {
          final chef = chefs[index];
          return ChefCard(
            name: chef['name']!,
            imagePath: chef['image']!,
            exp: chef['exp']!,
          );
        },
      ),
    );
  }
}