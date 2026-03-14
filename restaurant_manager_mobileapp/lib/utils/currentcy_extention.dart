import 'package:intl/intl.dart';

extension CurrencyExtension on num {
  String toVND() {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );

    return formatter.format(this);
  }
}