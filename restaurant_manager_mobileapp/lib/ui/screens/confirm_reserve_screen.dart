import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/data/reservation_api_service.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/menu_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_complete_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

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
              padding: const EdgeInsets.only(top: 20, left: 15, right: 15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Information table",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 7),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    height: 120,
                    decoration: BoxDecoration(
                      color: AppColors.conprofile,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 1,
                        color: Colors.black.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Text(
                          "Floor: ${widget.floor}",
                          style: const TextStyle(
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          "Table number: ${widget.tableNumber}",
                          style: const TextStyle(
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          "Seat: ${widget.seat}",
                          style: const TextStyle(
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          "Time slot: ${widget.timeSlot}",
                          style: const TextStyle(
                            fontFamily: AppFonts.poppins,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  const Text(
                    "Guest information",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 7),
                  Container(
                    width: double.infinity,
                    height: 265,
                    decoration: BoxDecoration(
                      color: AppColors.conprofile,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        width: 1,
                        color: Colors.black.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.only(
                        top: 15,
                        left: 10,
                        right: 10,
                      ),
                      child: Column(
                        children: [
                          TextFormField(
                            onTapOutside: (_) =>
                                FocusScope.of(context).unfocus(),
                            onChanged: (value) => name = value,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return "Please enter your name";
                              }
                              return null;
                            },
                            decoration: InputDecoration(
                              hintText: "Name",
                              hintStyle: const TextStyle(
                                color: AppColors.hinttext,
                              ),
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.1),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 15,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  width: 1,
                                  color: Colors.white,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: AppColors.icon,
                                  width: 1.5,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  width: 1,
                                  color: Colors.black.withValues(alpha: 0.5),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),
                          TextFormField(
                            onTapOutside: (_) =>
                                FocusScope.of(context).unfocus(),
                            onChanged: (value) => phone = value,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return "Please enter your phone number";
                              }
                              return null;
                            },
                            keyboardType: TextInputType.phone,
                            decoration: InputDecoration(
                              hintText: "Phone number",
                              hintStyle: const TextStyle(
                                color: AppColors.hinttext,
                              ),
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.1),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 15,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  width: 1,
                                  color: Colors.white,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: AppColors.icon,
                                  width: 1.5,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  width: 1,
                                  color: Colors.black.withValues(alpha: 0.5),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),
                          TextFormField(
                            onTapOutside: (_) =>
                                FocusScope.of(context).unfocus(),
                            onChanged: (value) => numberOfPeople = value,
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
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              hintText: "Number of people",
                              hintStyle: const TextStyle(
                                color: AppColors.hinttext,
                              ),
                              filled: true,
                              fillColor: Colors.white.withValues(alpha: 0.1),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 15,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  width: 1,
                                  color: Colors.white,
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: AppColors.icon,
                                  width: 1.5,
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(
                                  width: 1,
                                  color: Colors.black.withValues(alpha: 0.5),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 150),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.text,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
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
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Invalid guest count'),
                                ),
                              );
                              return;
                            }

                            if (guestCount > seatCount) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Guest count exceeds table capacity',
                                  ),
                                ),
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

                              Navigator.push(context,
                                AppRoute.slideFade(
                                  AppCompleteWidget(
                                    title: "Reservation successful!", 
                                    message: "Your table has been reserved. We look forward to serving you.", 
                                    question: "What would you like to do next?", 
                                    primaryText: "Order now", 
                                    onPrimaryPressed: () {
                                      Navigator.pushAndRemoveUntil(
                                        context,
                                        AppRoute.slideFade(const MenuScreen()),
                                        (route) => route.isFirst,
                                      );
                                    }
                                  )
                                )
                              );
                            } catch (e) {
                              if (!context.mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Reservation failed: $e'),
                                ),
                              );
                            } finally {
                              if (mounted) {
                                setState(() {
                                  isSubmitting = false;
                                });
                              }
                            }
                          },
                    child: Text(
                      isSubmitting ? "Submitting..." : "Confirm Reservation",
                      style: const TextStyle(
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
        ),
      ),
    );
  }
}
