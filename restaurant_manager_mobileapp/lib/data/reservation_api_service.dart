import 'dart:convert';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ReservationApiService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  static Future<Map<String, dynamic>> createReservation({
    required String customerName,
    required String phone,
    String? email,
    required DateTime reservationTime,
    required int guestCount,
    String? note,
    int? tableId,
  }) async {
    final uri = Uri.parse('$baseUrl/reservations');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'customerName': customerName,
        'phone': phone,
        'email': email,
        'reservationTime': reservationTime.toIso8601String(),
        'guestCount': guestCount,
        'note': note,
        'tableId': tableId,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Create reservation failed: ${response.body}');
    }

    return Map<String, dynamic>.from(jsonDecode(response.body));
  }

  static Future<Map<String, dynamic>> getPublicReservationStatus(
    int reservationId,
  ) async {
    final uri = Uri.parse('$baseUrl/reservations/public/status/$reservationId');

    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Load reservation status failed: ${response.body}');
    }

    return Map<String, dynamic>.from(jsonDecode(response.body));
  }
}
