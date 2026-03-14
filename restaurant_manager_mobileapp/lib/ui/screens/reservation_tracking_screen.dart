import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/reservation_api_service.dart';
import 'package:restaurant_manager_mobileapp/data/reservation_socket_service.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class ReservationTrackingScreen extends StatefulWidget {
  final int reservationId;

  const ReservationTrackingScreen({super.key, required this.reservationId});

  @override
  State<ReservationTrackingScreen> createState() =>
      _ReservationTrackingScreenState();
}

class _ReservationTrackingScreenState extends State<ReservationTrackingScreen> {
  bool isLoading = true;
  String? error;
  Map<String, dynamic>? reservation;

  @override
  void initState() {
    super.initState();
    _loadStatus();

    ReservationSocketService.connect(
      reservationId: widget.reservationId,
      onStatusChanged: (payload) {
        final rawReservation = payload['reservation'];
        if (rawReservation is Map) {
          setState(() {
            reservation = Map<String, dynamic>.from(rawReservation);
          });
        }
      },
    );
  }

  Future<void> _loadStatus() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });

      final result = await ReservationApiService.getPublicReservationStatus(
        widget.reservationId,
      );

      setState(() {
        reservation = result;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    ReservationSocketService.disconnect();
    super.dispose();
  }

  String _statusText(String? status) {
    switch (status) {
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
        return status ?? '-';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(title: "Reservation status"),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: isLoading
              ? const Center(child: CircularProgressIndicator())
              : error != null
              ? Center(child: Text(error!))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.conprofile,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.black.withValues(alpha: 0.08),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Reservation #${reservation?['id']}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Status: ${_statusText(reservation?['status']?.toString())}',
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Guests: ${reservation?['guestCount'] ?? '-'}',
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Assigned table: ${reservation?['table']?['tableNumber'] ?? reservation?['tableId'] ?? '-'}',
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Admin note: ${reservation?['adminNote'] ?? '-'}',
                            style: const TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'This screen will update automatically when admin processes your reservation.',
                      style: TextStyle(fontSize: 14),
                    ),
                    const Spacer(),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.text,
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pushAndRemoveUntil(
                          context,
                          AppRoute.slideFade(const MenuScreen()),
                          (route) => false,
                        );
                      },
                      child: const Text(
                        "Open menu",
                        style: TextStyle(
                          color: Colors.black,
                          fontFamily: AppFonts.poppins,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
