import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:restaurant_manager_mobileapp/data/public_tables_api_service.dart';
import 'package:restaurant_manager_mobileapp/data/time_slot.dart';
import 'package:restaurant_manager_mobileapp/test_data/table_item.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_reservation_card.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_select.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_table_card.dart';

class ReserveScreen extends StatefulWidget {
  final int initialTab;

  const ReserveScreen({super.key, this.initialTab = 0});

  @override
  State<ReserveScreen> createState() => _ReserveScreenState();
}

class _ReserveScreenState extends State<ReserveScreen> {
  String? selectedSlot;
  int? selectedFloor;
  late int selectIndex;

  List<TableItem> items = [];
  List<TableItem> allItems = [];

  bool isLoadingTables = false;
  String? tableError;

  final List<String> tabs = ["Reservation", "Reservation details"];
  late String currentDate;

  final List<TimeSlot> timeSlots = const [
    TimeSlot(name: "08:00", startHour: 8, endHour: 11),
    TimeSlot(name: "12:00", startHour: 12, endHour: 14),
    TimeSlot(name: "17:00", startHour: 17, endHour: 21),
  ];

  bool isSlotPassed(TimeSlot slot) {
    final now = DateTime.now();
    return now.hour >= slot.endHour;
  }

  @override
  void initState() {
    super.initState();
    selectIndex = widget.initialTab;

    final now = DateTime.now();
    currentDate = "${now.day}/${now.month}/${now.year}";

    loadAvailableTables();
  }

  Future<void> loadAvailableTables() async {
    try {
      setState(() {
        isLoadingTables = true;
        tableError = null;
      });

      final result = await PublicTablesApiService.fetchAvailableTables();

      setState(() {
        allItems = result;
        _applyFloorFilter();
      });
    } catch (e) {
      setState(() {
        tableError = e.toString();
      });
    } finally {
      if (mounted) {
        setState(() {
          isLoadingTables = false;
        });
      }
    }
  }

  void _applyFloorFilter() {
    if (selectedFloor == null) {
      items = List<TableItem>.from(allItems);
      return;
    }

    items = allItems.where((t) => t.floor == selectedFloor).toList();
  }

  @override
  Widget build(BuildContext context) {
    if (selectedSlot != null) {
      final slot = timeSlots.firstWhere((s) => s.name == selectedSlot);
      if (isSlotPassed(slot)) {
        selectedSlot = null;
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(title: "Reserve"),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            SizedBox(
              height: 40,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: tabs.length,
                itemBuilder: (context, index) {
                  final isSelected = selectIndex == index;

                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        selectIndex = index;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.text : Colors.transparent,
                        borderRadius: BorderRadius.circular(25),
                        border: Border.all(color: AppColors.textrofile),
                      ),
                      child: Text(
                        tabs[index],
                        style: TextStyle(
                          color: isSelected
                              ? AppColors.textrofile
                              : Colors.grey.shade700,
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.w500,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 10),
            selectIndex == 0
                ? Expanded(child: reservationTab())
                : Expanded(child: reservationDetailsTab()),
          ],
        ),
      ),
    );
  }

  Widget reservationTab() {
    return RefreshIndicator(
      onRefresh: loadAvailableTables,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Date",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 5),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 14,
                    ),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.black45),
                      borderRadius: BorderRadius.circular(10),
                      color: AppColors.conprofile,
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 18),
                        const SizedBox(width: 10),
                        Text(currentDate, style: const TextStyle(fontSize: 16)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 15),
            const Padding(
              padding: EdgeInsets.only(left: 15, bottom: 5),
              child: Text(
                "Select time slot",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(
              height: 65,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 15),
                itemCount: timeSlots.length,
                itemBuilder: (context, index) {
                  final slot = timeSlots[index];
                  final passed = isSlotPassed(slot);
                  final selected = selectedSlot == slot.name;

                  return GestureDetector(
                    onTap: passed
                        ? null
                        : () {
                            setState(() {
                              selectedSlot = slot.name;
                            });
                          },
                    child: Container(
                      width: 120,
                      margin: const EdgeInsets.only(right: 10),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: passed
                            ? Colors.grey.shade200
                            : selected
                            ? AppColors.text
                            : AppColors.background,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.black45),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            slot.name,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: passed ? Colors.grey : Colors.black,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "${slot.startHour}:00 - ${slot.endHour}:00",
                            style: TextStyle(
                              fontSize: 12,
                              color: passed
                                  ? Colors.grey
                                  : selected
                                  ? Colors.black54
                                  : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 15),
            const Padding(
              padding: EdgeInsets.only(left: 15, bottom: 5),
              child: Text(
                "Floor",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: AppSelect<int>(
                hint: "Select floor",
                prefixIcon: Icons.layers_outlined,
                initialValue: selectedFloor,
                items: const [
                  DropdownMenuEntry(value: 1, label: "1"),
                  DropdownMenuEntry(value: 2, label: "2"),
                  DropdownMenuEntry(value: 3, label: "3"),
                ],
                onChanged: (value) {
                  setState(() {
                    selectedFloor = value;
                    _applyFloorFilter();
                  });
                },
              ),
            ),
            const SizedBox(height: 15),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 15),
              child: _buildTablesSection(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTablesSection() {
    if (isLoadingTables) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 30),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (tableError != null) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.conprofile,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.black12),
        ),
        child: Column(
          children: [
            const Icon(Icons.error_outline, size: 32),
            const SizedBox(height: 10),
            Text(
              'The list of tables could not be loaded.\n$tableError',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: loadAvailableTables,
              child: const Text('Try again'),
            ),
          ],
        ),
      );
    }

    if (items.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.conprofile,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.black12),
        ),
        child: const Text(
          'There are no available tables matching your criteria.',
          textAlign: TextAlign.center,
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 15,
        mainAxisSpacing: 15,
        childAspectRatio: 1.4,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];

        return AppTableCard(item: item, selectedTimeSlot: selectedSlot);
      },
    );
  }

  Widget reservationDetailsTab() {
    return ValueListenableBuilder<ReservationSummary?>(
      valueListenable: AppSession.currentReservation,
      builder: (context, reservation, _) {
        if (reservation == null) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Text(
                'You have not made any reservations yet.\nGo to the "Reservation" tab to book a table.',
                textAlign: TextAlign.center,
              ),
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.all(16),
          child: AppReservationCard(reservation: reservation),
        );
      },
    );
  }
}
