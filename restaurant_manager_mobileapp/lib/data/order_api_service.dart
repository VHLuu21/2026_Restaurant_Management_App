import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:restaurant_manager_mobileapp/data/app_session.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OrderApiService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  static Future<Map<String, dynamic>> createOrder({
    required int reservationId,
    required List<Map<String, dynamic>> items,
    String? note,
  }) async {
    final uri = Uri.parse('$baseUrl/orders');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'reservationId': reservationId,
        'items': items,
        'note': note,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Create order failed: ${response.body}');
    }

    return Map<String, dynamic>.from(jsonDecode(response.body));
  }

  /// Fetch order details by ID
  static Future<Map<String, dynamic>> getOrderById(int id) async {
    final uri = Uri.parse('$baseUrl/orders/$id');

    // Lấy token từ SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    print("TOKEN FROM PREFS: $token");

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    print("ORDER API URL: $uri");
    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    if (response.statusCode != 200) {
      throw Exception("Failed to load order");
    }

    return Map<String, dynamic>.from(jsonDecode(response.body));
  }

  /// Fetch order ID by reservation ID
  static Future<int?> getOrderIdByReservation(int reservationId) async {
    final token = await AppSession.getToken();

    final url = Uri.parse("$baseUrl/orders/reservation/$reservationId");

    final response = await http.get(
      url,
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
    );

    if (response.statusCode == 200) {
      if (response.body == "null") {
        return null;
      }

      final data = jsonDecode(response.body);
      return data["id"];
    }

    return null;
  }
}
