import 'package:restaurant_manager_mobileapp/test_data/food_item.dart';

class OrderItem {
  final FoodItem food;
  final int quantity;

  OrderItem({
    required this.food,
    required this.quantity,
  });
}