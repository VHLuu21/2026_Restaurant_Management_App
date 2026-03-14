import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:restaurant_manager_mobileapp/test_data/table_item.dart';

class PublicTablesApiService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  static Future<List<TableItem>> fetchAvailableTables({int? guestCount}) async {
    final uri = Uri.parse(
      '$baseUrl/tables/public/available${guestCount != null ? '?guestCount=$guestCount' : ''}',
    );

    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Load tables failed: ${response.body}');
    }

    final List<dynamic> raw = jsonDecode(response.body) as List<dynamic>;

    return raw
        .map((e) => TableItem.fromApi(Map<String, dynamic>.from(e)))
        .toList();
  }
}
