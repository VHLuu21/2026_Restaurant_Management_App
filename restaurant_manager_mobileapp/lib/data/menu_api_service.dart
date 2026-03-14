import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class MobileMenuCategory {
  final int id;
  final String name;
  final String? description;

  MobileMenuCategory({required this.id, required this.name, this.description});

  factory MobileMenuCategory.fromApi(Map<String, dynamic> json) {
    return MobileMenuCategory(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: (json['name'] ?? '').toString(),
      description: json['description']?.toString(),
    );
  }
}

class MobileMenuDish {
  final int id;
  final String name;
  final String description;
  final int price;
  final String imageUrl;
  final int categoryId;
  final String categoryName;

  MobileMenuDish({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.categoryId,
    required this.categoryName,
  });

  factory MobileMenuDish.fromApi(Map<String, dynamic> json) {
    return MobileMenuDish(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: (json['name'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      price:
          int.tryParse(
            double.tryParse(json['price'].toString())?.toInt().toString() ??
                '0',
          ) ??
          0,
      imageUrl: (json['imageUrl'] ?? '').toString(),
      categoryId: int.tryParse(json['categoryId'].toString()) ?? 0,
      categoryName: (json['category']?['name'] ?? '').toString(),
    );
  }
}

class MenuApiService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  static Future<List<MobileMenuCategory>> fetchCategories() async {
    final uri = Uri.parse('$baseUrl/menu/categories/public/list');
    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Load categories failed: ${response.body}');
    }

    final List<dynamic> raw = jsonDecode(response.body) as List<dynamic>;
    return raw
        .map((e) => MobileMenuCategory.fromApi(Map<String, dynamic>.from(e)))
        .toList();
  }

  static Future<List<MobileMenuDish>> fetchDishes({int? categoryId}) async {
    final uri = Uri.parse(
      '$baseUrl/menu/dishes/public/list${categoryId != null ? '?categoryId=$categoryId' : ''}',
    );

    final response = await http.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Load dishes failed: ${response.body}');
    }

    final List<dynamic> raw = jsonDecode(response.body) as List<dynamic>;
    return raw
        .map((e) => MobileMenuDish.fromApi(Map<String, dynamic>.from(e)))
        .toList();
  }
}
