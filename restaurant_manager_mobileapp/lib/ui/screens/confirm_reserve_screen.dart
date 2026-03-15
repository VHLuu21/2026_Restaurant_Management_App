import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/data/reservation_api_service.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_complete_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_showSnackbar.dart';

class ConfirmReserveScreen extends StatefulWidget {
  final int tableId;
  final String floor;
  final String tableNumber;
  final String seat;
  final String timeSlot;

  const ConfirmReserveScreen({
    super.key,
    required this.tableId,
    required this.floor,
    required this.tableNumber,
    required this.seat,
    required this.timeSlot,
  });

  @override
  State<ConfirmReserveScreen> createState() => _ConfirmReserveScreenState();
}

class _ConfirmReserveScreenState extends State<ConfirmReserveScreen> {
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();

  String? name;
  String? phone;
  String? numberOfPeople;
  bool isSubmitting = false;

  DateTime _buildReservationDateTime(String slot) {
    final now = DateTime.now();
    final parts = slot.split(':');

    final hour = int.parse(parts[0]);
    final minute = int.parse(parts[1]);

    return DateTime(now.year, now.month, now.day, hour, minute);
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.icon),
          const SizedBox(width: 8),
          Text(
            "$label: ",
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontFamily: AppFonts.poppins,
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontFamily: AppFonts.poppins),
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration({
    required String hint,
    required IconData icon,
  }) {
    return InputDecoration(
      prefixIcon: Icon(icon),
      hintText: hint,
      hintStyle: const TextStyle(color: AppColors.hinttext),
      filled: true,
      fillColor: Colors.white.withValues(alpha: 0.1),
      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(width: 1, color: Colors.white),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.icon, width: 1.5),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          width: 1,
          color: Colors.black.withValues(alpha: 0.5),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(title: "Reserve a table"),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Table information",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 8),

                  /// TABLE INFO CARD
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.conprofile,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.black12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _infoRow(Icons.layers_outlined, "Floor", widget.floor),
                        _infoRow(
                          Icons.table_restaurant,
                          "Table",
                          widget.tableNumber,
                        ),
                        _infoRow(Icons.event_seat, "Seat", widget.seat),
                        _infoRow(Icons.access_time, "Time", widget.timeSlot),
                      ],
                    ),
                  ),

                  const SizedBox(height: 25),

                  const Text(
                    "Guest information",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),

                  const SizedBox(height: 10),

                  /// NAME
                  TextFormField(
                    onTapOutside: (_) => FocusScope.of(context).unfocus(),
                    onChanged: (value) => name = value,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please enter your name";
                      }
                      return null;
                    },
                    decoration: _inputDecoration(
                      hint: "Your name",
                      icon: Icons.person_outline,
                    ),
                  ),

                  const SizedBox(height: 12),

                  /// PHONE
                  TextFormField(
                    onTapOutside: (_) => FocusScope.of(context).unfocus(),
                    onChanged: (value) => phone = value,
                    keyboardType: TextInputType.phone,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please enter your phone number";
                      }
                      return null;
                    },
                    decoration: _inputDecoration(
                      hint: "Phone number",
                      icon: Icons.phone_outlined,
                    ),
                  ),

                  const SizedBox(height: 12),

                  /// GUEST COUNT
                  TextFormField(
                    onTapOutside: (_) => FocusScope.of(context).unfocus(),
                    onChanged: (value) => numberOfPeople = value,
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Please enter the number of people";
                      }
                      final parsed = int.tryParse(value);
                      if (parsed == null || parsed <= 0) {
                        return "Invalid guest count";
                      }
                      return null;
                    },
                    decoration: _inputDecoration(
                      hint: "Number of guests",
                      icon: Icons.groups_outlined,
                    ),
                  ),

                  const SizedBox(height: 30),

                  /// CONFIRM BUTTON
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.text,
                      elevation: 3,
                      shadowColor: Colors.black26,
                      minimumSize: const Size(double.infinity, 55),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: isSubmitting
                        ? null
                        : () async {
                            if (!formKey.currentState!.validate()) return;

                            final guestCount = int.tryParse(
                              numberOfPeople?.trim() ?? '',
                            );
                            final seatCount = int.tryParse(widget.seat) ?? 0;

                            if (guestCount == null || guestCount <= 0) {
                              AppShowsnackbar().showCustomSnackBar(
                                "Invalid guest count",
                                false,
                                context,
                              );
                              return;
                            }

                            if (guestCount > seatCount) {
                              AppShowsnackbar().showCustomSnackBar(
                                "Guest count exceeds seat capacity",
                                false,
                                context,
                              );
                              return;
                            }

                            try {
                              setState(() {
                                isSubmitting = true;
                              });

                              final result =
                                  await ReservationApiService.createReservation(
                                    customerName: name!.trim(),
                                    phone: phone!.trim(),
                                    reservationTime: _buildReservationDateTime(
                                      widget.timeSlot,
                                    ),
                                    guestCount: guestCount,
                                    note:
                                        'Mobile booking - Floor ${widget.floor} - Table ${widget.tableNumber}',
                                    tableId: widget.tableId,
                                  );

                              AppSession.setReservation(
                                ReservationSummary.fromCreateResponse(
                                  json: result,
                                  tableId: widget.tableId,
                                  tableNumber: widget.tableNumber,
                                  floor: int.tryParse(widget.floor) ?? 1,
                                  timeSlot: widget.timeSlot,
                                  customerName: name!.trim(),
                                  phone: phone!.trim(),
                                ),
                              );

                              if (!context.mounted) return;

                              Navigator.push(
                                context,
                                AppRoute.slideFade(
                                  AppCompleteWidget(
                                    title: "Reservation successful!",
                                    message:
                                        "Your table has been reserved. We look forward to serving you.",
                                    question:
                                        "What would you like to do next?",
                                    primaryText: "Order now",
                                    onPrimaryPressed: () {
                                      Navigator.pushAndRemoveUntil(
                                        context,
                                        AppRoute.slideFade(const MenuScreen()),
                                        (route) => route.isFirst,
                                      );
                                    },
                                  ),
                                ),
                              );
                            } catch (e) {
                              if (!context.mounted) return;

                              AppShowsnackbar().showCustomSnackBar(
                                "Failed to create reservation. Please try again.",
                                false,
                                context,
                              );
                            } finally {
                              if (mounted) {
                                setState(() {
                                  isSubmitting = false;
                                });
                              }
                            }
                          },
                    child: isSubmitting
                        ? const SizedBox(
                            height: 22,
                            width: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.black,
                            ),
                          )
                        : const Text(
                            "Confirm Reservation",
                            style: TextStyle(
                              color: Colors.black,
                              fontFamily: AppFonts.poppins,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}