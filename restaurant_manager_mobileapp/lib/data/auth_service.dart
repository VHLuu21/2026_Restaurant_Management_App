import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';

  /// LOGIN
  static Future<bool> login(String email, String password) async {
    final url = Uri.parse("$baseUrl/auth/login");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    print("LOGIN STATUS: ${response.statusCode}");
    print("LOGIN BODY: ${response.body}");

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", data["accessToken"]);
      await prefs.setString("fullName", data["user"]["fullName"]);
      await prefs.setString("email", data["user"]["email"]);

      return true;
    }

    return false;
  }

  /// REGISTER
  static Future<bool> register(
    String email,
    String fullName,
    String password,
  ) async {
    final url = Uri.parse("$baseUrl/auth/register");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "fullName": fullName,
        "password": password,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      return true;
    }

    return false;
  }

  /// FORGOT PASSWORD
  static Future<bool> forgotPassword(String email) async {
    final url = Uri.parse("$baseUrl/auth/forgot-password");

    print("URL: $url");
    print("EMAIL: $email");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email}),
    );

    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    return response.statusCode == 200 || response.statusCode == 201;
  }

  /// VERIFY OTP
  static Future<bool> verifyOTP(String email, String otp) async {
    final url = Uri.parse("$baseUrl/auth/verify-otp");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "otp": otp}),
    );

    print("VERIFY OTP URL: $url");
    print("EMAIL: $email");
    print("OTP: $otp");
    print("STATUS: ${response.statusCode}");
    print("BODY: ${response.body}");

    return response.statusCode == 200 || response.statusCode == 201;
  }

  /// UPDATE PASSWORD
  static Future<bool> updatePassword(
    String email,
    String otp,
    String newPassword,
  ) async {
    final url = Uri.parse("$baseUrl/auth/reset-password");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "otp": otp,
        "newPassword": newPassword,
      }),
    );

    return response.statusCode == 200 || response.statusCode == 201;
  }
}
