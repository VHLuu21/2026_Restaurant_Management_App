import 'package:flutter/foundation.dart';
import 'package:restaurant_manager_mobileapp/data/menu_api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ReservationSummary {
  final int id;
  final int tableId;
  final String tableNumber;
  final int floor;
  final int guestCount;
  final DateTime reservationTime;
  final String timeSlot;
  final String status;
  final String customerName;
  final String phone;

  ReservationSummary({
    required this.id,
    required this.tableId,
    required this.tableNumber,
    required this.floor,
    required this.guestCount,
    required this.reservationTime,
    required this.timeSlot,
    required this.status,
    required this.customerName,
    required this.phone,
  });

  factory ReservationSummary.fromCreateResponse({
    required Map<String, dynamic> json,
    required int tableId,
    required String tableNumber,
    required int floor,
    required String timeSlot,
    required String customerName,
    required String phone,
  }) {
    return ReservationSummary(
      id: int.tryParse(json['id'].toString()) ?? 0,
      tableId: tableId,
      tableNumber: tableNumber,
      floor: floor,
      guestCount: int.tryParse(json['guestCount'].toString()) ?? 1,
      reservationTime:
          DateTime.tryParse(json['reservationTime']?.toString() ?? '') ??
          DateTime.now(),
      timeSlot: timeSlot,
      status: (json['status'] ?? 'PENDING').toString(),
      customerName: customerName,
      phone: phone,
    );
  }
}

class CartLine {
  final MobileMenuDish dish;
  final int quantity;

  CartLine({required this.dish, required this.quantity});

  CartLine copyWith({MobileMenuDish? dish, int? quantity}) {
    return CartLine(
      dish: dish ?? this.dish,
      quantity: quantity ?? this.quantity,
    );
  }
}

class AppSession {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("token");
  }

  static final ValueNotifier<ReservationSummary?> currentReservation =
      ValueNotifier(null);

  static final ValueNotifier<Map<int, CartLine>> cart = ValueNotifier(
    <int, CartLine>{},
  );

  static void setReservation(ReservationSummary reservation) {
    currentReservation.value = reservation;
    clearCart();
  }

  static void clearReservation() {
    currentReservation.value = null;
    clearCart();
  }

  static void addDish(MobileMenuDish dish) {
    final current = Map<int, CartLine>.from(cart.value);

    if (current.containsKey(dish.id)) {
      final line = current[dish.id]!;
      current[dish.id] = line.copyWith(quantity: line.quantity + 1);
    } else {
      current[dish.id] = CartLine(dish: dish, quantity: 1);
    }

    cart.value = current;
  }

  static void removeDish(int dishId) {
    final current = Map<int, CartLine>.from(cart.value);

    if (!current.containsKey(dishId)) return;

    final line = current[dishId]!;
    if (line.quantity <= 1) {
      current.remove(dishId);
    } else {
      current[dishId] = line.copyWith(quantity: line.quantity - 1);
    }

    cart.value = current;
  }

  static void clearCart() {
    cart.value = <int, CartLine>{};
  }

  static int get cartCount =>
      cart.value.values.fold(0, (sum, item) => sum + item.quantity);

  static int get totalPrice => cart.value.values.fold(
    0,
    (sum, item) => sum + item.dish.price * item.quantity,
  );
}
