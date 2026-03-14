import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/order_details_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_complete_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_order_food_card.dart';
import 'package:restaurant_manager_mobileapp/data/order_api_service.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showSnackbar.dart';
import 'package:restaurant_manager_mobileapp/utils/currentcy_extention.dart';

class OrderScreen extends StatelessWidget {
  const OrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ReservationSummary?>(
      valueListenable: AppSession.currentReservation,
      builder: (context, reservation, _) {
        return ValueListenableBuilder<Map<int, CartLine>>(
          valueListenable: AppSession.cart,
          builder: (context, cart, __) {
            final orderItems = cart.values.toList();

            return Scaffold(
              backgroundColor: AppColors.background,
              appBar: AppCustomAppBar(
                title: "Your Order",
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
              body: reservation == null
                  ? const Center(
                      child: Text(
                        'You need to reserve a table before placing an order.',
                      ),
                    )
                  : Column(
                      children: [
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Table",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: const Color(0xffE8DFC8),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Floor: ${reservation.floor}",
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w500,
                                          fontFamily: AppFonts.poppins,
                                        ),
                                      ),
                                      Text(
                                        "Table: ${reservation.tableNumber}",
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w500,
                                          fontFamily: AppFonts.poppins,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 25),
                                const Text(
                                  "Order Details",
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Expanded(
                                  child: orderItems.isEmpty
                                      ? const Center(
                                          child: Text(
                                            'Your cart is empty. Start adding dishes to your order!',
                                          ),
                                        )
                                      : ListView.builder(
                                          itemCount: orderItems.length,
                                          itemBuilder: (context, index) {
                                            final item = orderItems[index];

                                            return AppOrderFoodCard(
                                              image: item.dish.imageUrl,
                                              name: item.dish.name,
                                              price: item.dish.price,
                                              quantity: item.quantity,
                                              onAdd: () {
                                                AppSession.addDish(item.dish);
                                              },
                                              onRemove: () {
                                                AppSession.removeDish(
                                                  item.dish.id,
                                                );
                                              },
                                            );
                                          },
                                        ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(20),
                              topRight: Radius.circular(20),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.05),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "Total",
                                    style: TextStyle(
                                      color: Colors.grey,
                                      fontSize: 14,
                                    ),
                                  ),
                                  Text(
                                    AppSession.totalPrice.toVND(),
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.text,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 35,
                                    vertical: 14,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                onPressed: orderItems.isEmpty
                                    ? null
                                    : () async {
                                        try {
                                          final payloadItems = orderItems
                                              .map(
                                                (item) => {
                                                  'dishId': item.dish.id,
                                                  'quantity': item.quantity,
                                                },
                                              )
                                              .toList();

                                          final order = await OrderApiService.createOrder(
                                            reservationId: reservation.id,
                                            items: payloadItems,
                                            note: 'Mobile order',
                                          );

                                          final orderId = order['id'];

                                          AppSession.clearCart();

                                          if (!context.mounted) return;

                                          Navigator.push(
                                            context,
                                            AppRoute.slideFade(
                                              AppCompleteWidget(
                                                title: "Order Placed!",
                                                message:
                                                    "Your order has been placed successfully.",
                                                question:
                                                    "What would you like to do next?",
                                                primaryText: "View Order",
                                                onPrimaryPressed: () =>
                                                    Navigator.pushAndRemoveUntil(
                                                      context,
                                                      AppRoute.slideFade(
                                                        OrderDetailsScreen(orderId: orderId),
                                                      ),
                                                      (route) => route.isFirst,
                                                    ),
                                              ),
                                            ),
                                          );
                                        } catch (e) {
                                          if (!context.mounted) return;

                                          AppShowsnackbar().showCustomSnackBar(
                                            "Failed to place order: $e",
                                            false,
                                            context,
                                          );
                                        }
                                      },
                                child: const Text(
                                  "Place Order",
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
            );
          },
        );
      },
    );
  }
}
