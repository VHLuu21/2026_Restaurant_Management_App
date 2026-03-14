import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/order_screen.dart';

class AppViewOrderBar extends StatelessWidget {
  final int count;

  const AppViewOrderBar({super.key, required this.count});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFE8DFC8),
      borderRadius: BorderRadius.circular(14),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const OrderScreen()),
          );
        },
        child: Container(
          height: 55,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.black54),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.shopping_cart_outlined),
              const SizedBox(width: 8),
              Text(
                "View Order: $count",
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
