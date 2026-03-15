import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/menu_api_service.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showSnackbar.dart';
import 'package:restaurant_manager_mobileapp/utils/currentcy_extention.dart';

class AppFoodVertical extends StatelessWidget {
  final List<MobileMenuDish> items;
  final Map<int, int> quantities;
  final bool canOrder;
  final ValueChanged<MobileMenuDish> onAddToCart;
  final ValueChanged<int> onRemoveFromCart;
  final ValueChanged<MobileMenuDish>? onFoodTap;

  const AppFoodVertical({
    super.key,
    required this.items,
    required this.quantities,
    required this.canOrder,
    required this.onAddToCart,
    required this.onRemoveFromCart,
    this.onFoodTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: items.length,
      padding: const EdgeInsets.only(top: 5, left: 8, right: 8, bottom: 90),
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final food = items[index];
        final quantity = quantities[food.id] ?? 0;

        return GestureDetector(
          onTap: () => onFoodTap?.call(food),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 6,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: _buildImage(food.imageUrl),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        food.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 5),
                      Text(
                        food.description.isEmpty
                            ? food.categoryName
                            : food.description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.grey.shade700,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        food.price.toVND(),
                        style: const TextStyle(
                          color: Colors.amber,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                _buildActionButton(
                  context: context,
                  food: food,
                  quantity: quantity,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildActionButton({
    required BuildContext context,
    required MobileMenuDish food,
    required int quantity,
  }) {
    /// Không cho order
    if (!canOrder) {
      return GestureDetector(
        onTap: () {
          AppShowsnackbar().showCustomSnackBar(
            "You cannot order with the current reservation status.",
            false,
            context,
          );
        },
        child: Container(
          height: 35,
          width: 80,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            borderRadius: BorderRadius.circular(5),
          ),
          child: const Text("ADD", style: TextStyle(fontSize: 12)),
        ),
      );
    }

    /// Nút ADD
    if (quantity == 0) {
      return GestureDetector(
        onTap: () => onAddToCart(food),
        child: Container(
          height: 35,
          width: 80,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: AppColors.text,
            borderRadius: BorderRadius.circular(5),
            border: Border.all(width: 1, color: AppColors.general),
          ),
          child: const Text(
            "ADD",
            style: TextStyle(
              color: Colors.black,
              fontFamily: AppFonts.poppins,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      );
    }

    /// Nút +/- khi đã có trong cart
    return Container(
      height: 35,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: AppColors.text,
        borderRadius: BorderRadius.circular(5),
        border: Border.all(width: 1, color: AppColors.general),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => onRemoveFromCart(food.id),
            child: const Icon(Icons.remove, size: 18),
          ),
          const SizedBox(width: 8),
          Text(
            quantity.toString(),
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () => onAddToCart(food),
            child: const Icon(Icons.add, size: 18),
          ),
        ],
      ),
    );
  }

  Widget _buildImage(String path) {
    if (path.isNotEmpty && path.startsWith('http')) {
      return Image.network(
        path,
        width: 90,
        height: 90,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _placeholder(),
      );
    }

    return _placeholder();
  }

  Widget _placeholder() {
    return Container(
      width: 90,
      height: 90,
      color: const Color(0xFFF4F4F4),
      alignment: Alignment.center,
      child: const Icon(Icons.restaurant_menu, size: 30),
    );
  }
}
