import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/test_data/food_item.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_food_card.dart';

class FoodHorizontalList extends StatelessWidget {
  final List<FoodItem> items;

  const FoodHorizontalList({super.key, required this.items});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 220,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 1),
        itemCount: items.length,
        itemBuilder: (context, index) {
          return FoodCard(item: items[index]);
        },
      ),
    );
  }
}