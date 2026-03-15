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

  /// CREATE RESERVATION RESPONSE
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

  /// COPY WITH (update object safely)
  ReservationSummary copyWith({
    int? id,
    int? tableId,
    String? tableNumber,
    int? floor,
    int? guestCount,
    DateTime? reservationTime,
    String? timeSlot,
    String? status,
    String? customerName,
    String? phone,
  }) {
    return ReservationSummary(
      id: id ?? this.id,
      tableId: tableId ?? this.tableId,
      tableNumber: tableNumber ?? this.tableNumber,
      floor: floor ?? this.floor,
      guestCount: guestCount ?? this.guestCount,
      reservationTime: reservationTime ?? this.reservationTime,
      timeSlot: timeSlot ?? this.timeSlot,
      status: status ?? this.status,
      customerName: customerName ?? this.customerName,
      phone: phone ?? this.phone,
    );
  }

  /// UPDATE STATUS FROM API
  factory ReservationSummary.fromStatusJson(
    ReservationSummary old,
    Map<String, dynamic> json,
  ) {
    return old.copyWith(status: (json['status'] ?? old.status).toString());
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
  /// TOKEN
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("token");
  }

  /// CURRENT RESERVATION
  static final ValueNotifier<ReservationSummary?> currentReservation =
      ValueNotifier(null);

  /// CART
  static final ValueNotifier<Map<int, CartLine>> cart = ValueNotifier(
    <int, CartLine>{},
  );

  /// SET RESERVATION
  static void setReservation(
    ReservationSummary reservation, {
    bool clearCartItems = true,
  }) {
    currentReservation.value = reservation;

    if (clearCartItems) {
      clearCart();
    }
  }

  /// CLEAR RESERVATION
  static void clearReservation() {
    currentReservation.value = null;
    clearCart();
  }

  /// ADD DISH
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

  /// REMOVE DISH
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

  /// CLEAR CART
  static void clearCart() {
    cart.value = <int, CartLine>{};
  }

  /// TOTAL ITEMS
  static int get cartCount =>
      cart.value.values.fold(0, (sum, item) => sum + item.quantity);

  /// TOTAL PRICE
  static int get totalPrice => cart.value.values.fold(
    0,
    (sum, item) => sum + item.dish.price * item.quantity,
  );
}
