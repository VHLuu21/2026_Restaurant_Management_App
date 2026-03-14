import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/order_api_service.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/order_details_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class AppReservationCard extends StatefulWidget {
  final ReservationSummary reservation;

  const AppReservationCard({super.key, required this.reservation});

  @override
  State<AppReservationCard> createState() => _AppReservationCardState();
}

class _AppReservationCardState extends State<AppReservationCard> {
  int? orderId;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    checkOrder();
  }

  Future<void> checkOrder() async {
    try {
      final id = await OrderApiService.getOrderIdByReservation(
        widget.reservation.id,
      );

      setState(() {
        orderId = id;
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  String _statusText(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'REJECTED':
        return 'Rejected';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  }

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return Colors.green;
      case 'REJECTED':
      case 'CANCELLED':
        return Colors.red;
      case 'COMPLETED':
        return Colors.blue;
      default:
        return Colors.orange;
    }
  }

  String get dateText =>
      "${widget.reservation.reservationTime.day}/${widget.reservation.reservationTime.month}/${widget.reservation.reservationTime.year}";

  @override
  Widget build(BuildContext context) {
    final reservation = widget.reservation;
    final statusColor = _statusColor(reservation.status);

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.conprofile,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.table_bar),
                  const SizedBox(width: 8),
                  Text(
                    "Table ${reservation.tableNumber}",
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _statusText(reservation.status),
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            "Floor ${reservation.floor}",
            style: const TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 12),

          /// DATE
          Row(
            children: [
              const Icon(Icons.calendar_today, size: 16),
              const SizedBox(width: 6),
              Text(dateText),
            ],
          ),

          const SizedBox(height: 6),

          /// TIME
          Row(
            children: [
              const Icon(Icons.access_time, size: 16),
              const SizedBox(width: 6),
              Text(reservation.timeSlot),
            ],
          ),

          const SizedBox(height: 6),

          /// GUEST
          Row(
            children: [
              const Icon(Icons.groups, size: 16),
              const SizedBox(width: 6),
              Text("${reservation.guestCount} guests"),
            ],
          ),

          const SizedBox(height: 20),

          /// ORDER BUTTON
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.text,
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              onPressed: loading
                  ? null
                  : () {
                      if (orderId == null) {
                        Navigator.push(
                          context,
                          AppRoute.slideFade(MenuScreen()),
                        );
                      } else {
                        Navigator.push(
                          context,
                          AppRoute.slideFade(
                            OrderDetailsScreen(orderId: orderId!),
                          ),
                        );
                      }
                    },
              child: loading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Text(
                      orderId == null ? "Order Food" : "View Order",
                      style: const TextStyle(
                        color: Colors.black87,
                        fontFamily: AppFonts.montserrat,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),

          const SizedBox(height: 10),

          /// CANCEL BUTTON
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Hiện tại mobile chưa bật hủy reservation từ server.',
                    ),
                  ),
                );
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Colors.redAccent),
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                "Cancel Reservation",
                style: TextStyle(color: Colors.red),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
