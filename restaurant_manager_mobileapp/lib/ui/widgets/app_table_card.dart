import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/test_data/table_item.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';
import 'package:restaurant_manager_mobileapp/ui/screens/confirm_reserve_screen.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_route.dart';

class AppTableCard extends StatefulWidget {
  final TableItem item;
  final String? selectedTimeSlot;

  const AppTableCard({
    super.key,
    required this.item,
    required this.selectedTimeSlot,
  });

  @override
  State<AppTableCard> createState() => _AppTableCardState();
}

class _AppTableCardState extends State<AppTableCard> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (widget.item.tableStatus != 'Available') return;

        if (widget.selectedTimeSlot == null) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Please select a time slot first')),
          );
          return;
        }

        Navigator.push(
          context,
          AppRoute.slideFade(
            ConfirmReserveScreen(
              tableId: widget.item.id,
              floor: widget.item.floor.toString(),
              tableNumber: widget.item.numberOfTable,
              seat: widget.item.tableSeat.toString(),
              timeSlot: widget.selectedTimeSlot!,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.tableBg,
          border: Border.all(width: 2, color: AppColors.tableBorder),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 2, bottom: 2),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.item.tableStatus,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  fontFamily: AppFonts.roboto,
                  color: widget.item.tableStatus == "Available"
                      ? Colors.green
                      : Colors.red,
                ),
              ),
              Text(
                widget.item.numberOfTable,
                style: const TextStyle(
                  fontFamily: AppFonts.montserrat,
                  fontSize: 40,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.groups, size: 16),
                  const SizedBox(width: 5),
                  Text(
                    widget.item.tableSeat.toString(),
                    style: const TextStyle(
                      fontFamily: AppFonts.poppins,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 2),
                  const Text(
                    "Seats",
                    style: TextStyle(
                      fontFamily: AppFonts.roboto,
                      fontSize: 16,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
