import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/data/menu_api_service.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/food_detail_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_food_vertical.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showSnackbar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_view_orderbar.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  int selectedIndex = 0;

  List<MobileMenuCategory> categories = [];
  List<MobileMenuDish> dishes = [];

  bool isLoadingCategories = false;
  bool isLoadingDishes = false;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    try {
      setState(() {
        isLoadingCategories = true;
        error = null;
      });

      final result = await MenuApiService.fetchCategories();

      setState(() {
        categories = result;
      });

      if (categories.isNotEmpty) {
        await _loadDishes(categories.first.id);
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          isLoadingCategories = false;
        });
      }
    }
  }

  Future<void> _loadDishes(int categoryId) async {
    try {
      setState(() {
        isLoadingDishes = true;
        error = null;
      });

      final result = await MenuApiService.fetchDishes(categoryId: categoryId);

      setState(() {
        dishes = result;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          isLoadingDishes = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ReservationSummary?>(
      valueListenable: AppSession.currentReservation,
      builder: (context, reservation, _) {
        return ValueListenableBuilder<Map<int, CartLine>>(
          valueListenable: AppSession.cart,
          builder: (context, cart, __) {
            final quantities = <int, int>{};
            for (final entry in cart.entries) {
              quantities[entry.key] = entry.value.quantity;
            }

            return Scaffold(
              backgroundColor: AppColors.background,
              appBar: AppCustomAppBar(title: "Menu"),
              body: SafeArea(
                child: Stack(
                  children: [
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        if (isLoadingCategories)
                          const Expanded(
                            child: Center(child: CircularProgressIndicator()),
                          )
                        else if (error != null)
                          Expanded(
                            child: Center(
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Text(
                                  error!,
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          )
                        else if (categories.isEmpty)
                          const Expanded(
                            child: Center(
                              child: Text('No menu categories found.'),
                            ),
                          )
                        else ...[
                          SizedBox(
                            height: 40,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                              ),
                              itemCount: categories.length,
                              itemBuilder: (context, index) {
                                final isSelected = selectedIndex == index;
                                final item = categories[index];

                                return GestureDetector(
                                  onTap: () async {
                                    setState(() {
                                      selectedIndex = index;
                                    });
                                    await _loadDishes(item.id);
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.only(right: 10),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 18,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? AppColors.text
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(25),
                                      border: Border.all(
                                        color: AppColors.textrofile,
                                      ),
                                    ),
                                    child: Text(
                                      item.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w500,
                                        color: isSelected
                                            ? AppColors.textrofile
                                            : Colors.grey.shade700,
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 10),
                          Expanded(
                            child: isLoadingDishes
                                ? const Center(
                                    child: CircularProgressIndicator(),
                                  )
                                : dishes.isEmpty
                                ? const Center(
                                    child: Text(
                                      'No dishes available in this category.',
                                    ),
                                  )
                                : AppFoodVertical(
                                    items: dishes,
                                    quantities: quantities,
                                    canOrder: reservation != null,
                                    onFoodTap: (food) {
                                      Navigator.push(
                                        context,
                                        AppRoute.slideFade(
                                          FoodDetailScreen(food: food),
                                        ),
                                      );
                                    },
                                    onAddToCart: (dish) {
                                      if (reservation == null) {
                                        AppShowsnackbar().showCustomSnackBar(
                                          "Please make a reservation before adding items to the cart.",
                                          false,
                                          context,
                                        );
                                        return;
                                      }

                                      AppSession.addDish(dish);
                                    },
                                    onRemoveFromCart: (dishId) {
                                      AppSession.removeDish(dishId);
                                    },
                                  ),
                          ),
                        ],
                      ],
                    ),
                    if (AppSession.cartCount > 0)
                      Positioned(
                        bottom: 20,
                        left: 20,
                        right: 20,
                        child: AppViewOrderBar(count: AppSession.cartCount),
                      ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
