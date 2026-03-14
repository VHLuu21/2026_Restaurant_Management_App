import 'package:restaurant_manager_mobileapp/test_data/food_item.dart';

class FoodData {
  static final List<String> categories = [
    "Main course",
    "Appetizer",
    "Dessert",
    "Beverage",
  ];

  static final List<FoodItem> foods = [
    FoodItem(
      id: 1,
      image: 'assets/imgs/test/food1.png',
      name: 'Grilled Salmon',
      desc: 'Lorem ciacnn baliic baliic dnda ẩm...',
      rating: 4.9,
      price: 340000,
      category: "Main course"
    ),
    FoodItem(
      id: 2,
      image: 'assets/imgs/test/food2.png',
      name: 'Shrimp Pasta',
      desc: 'Delicious creamy pasta...',
      rating: 4.7,
      price: 200000,
      category: "Appetizer",

    ),
    FoodItem(
      id: 3,
      image: 'assets/imgs/test/food3.png',
      name: 'Shrimp Pasta',
      desc: 'Delicious creamy pasta...',
      rating: 4.6,
      price: 150000,
      category: "Dessert",
    ),
  ];

  static final List<FoodItem> foodus = [
    FoodItem(
      id: 4,
      image: 'assets/imgs/test/foodus1.png',
      name: 'Grilled Salmon',
      desc: 'Lorem ciacnn baliic baliic dnda ẩm...',
      rating: 4.9,
      price: 120000,
      category: "Dessert",
    ),
    FoodItem(
      id: 5,
      image: 'assets/imgs/test/foodus2.png',
      name: 'Grilled Salmon',
      desc: 'Lorem ciacnn baliic baliic dnda ẩm...',
      rating: 4.9,
      price: 120000,
      category: "Dessert",
    ),
    FoodItem(
      id: 6,
      image: 'assets/imgs/test/foodus3.png',
      name: 'Grilled Salmon',
      desc: 'Lorem ciacnn baliic baliic dnda ẩm...',
      rating: 4.9,
      price: 120000,
      category: "Dessert",
    ),
  ];
}
