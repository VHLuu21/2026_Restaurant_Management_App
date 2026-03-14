import 'package:dotted_line/dotted_line.dart';
import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/ui/widgets/app_custom_app_bar.dart';
import 'package:restaurant_manager_mobileapp/data/order_api_service.dart';
import 'package:restaurant_manager_mobileapp/utils/currentcy_extention.dart';

class OrderDetailsScreen extends StatefulWidget {
  final int orderId;

  const OrderDetailsScreen({super.key, required this.orderId});

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState();
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  Map<String, dynamic>? orderData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadOrder();
  }

  Future<void> loadOrder() async {
    final data = await OrderApiService.getOrderById(widget.orderId);

    setState(() {
      orderData = data;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final items = orderData!['items'] as List;

    int subtotal = 0;
    for (var item in items) {
      subtotal += double.parse(item['lineTotal'].toString()).toInt();
    }

    int serviceFee = 0;
    int total = subtotal + serviceFee;

    final tableNumber =
        orderData!['reservation']?['table']?['tableNumber'] ?? "Unknown";

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppCustomAppBar(
        title: "Order Details",
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ReservationCard(tableNumber: tableNumber),

            const SizedBox(height: 20),

            const Text(
              "My Order",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 12),

            Expanded(
              child: ListView.builder(
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];

                  return OrderDetailsFoodCard(
                    name: item['dishName'],
                    price: double.parse(item['unitPrice'].toString()).toInt(),
                    quantity: item['quantity'],
                    imageUrl: item['dish']['imageUrl'],
                  );
                },
              ),
            ),

            OrderSummary(
              subtotal: subtotal,
              serviceFee: serviceFee,
              total: total,
            ),
          ],
        ),
      ),
    );
  }
}

class ReservationCard extends StatelessWidget {
  final String tableNumber;

  const ReservationCard({super.key, required this.tableNumber});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.conprofile,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            blurRadius: 10,
            color: Colors.black.withValues(alpha: 0.15),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.table_bar),
          const SizedBox(width: 8),
          Text(
            "Table $tableNumber",
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

class OrderDetailsFoodCard extends StatelessWidget {
  final String name;
  final int price;
  final int quantity;
  final String? imageUrl;

  const OrderDetailsFoodCard({
    super.key,
    required this.name,
    required this.price,
    required this.quantity,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xffE7DCC0),
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: Row(
        children: [
          /// Image with fallback icon
          ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Image.network(
              imageUrl ?? '',
              width: 70,
              height: 70,
              fit: BoxFit.cover,
              errorBuilder: (context, errer, stackTrace) {
                return const Icon(Icons.fastfood, size: 40);
              }
            ),
          ),

          const SizedBox(width: 14),
          /// Name and price
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  price.toVND(),
                  style: const TextStyle(color: Colors.black45),
                ),
              ],
            ),
          ),
          /// Quantity badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
            height: 30,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.brown, width: 2),
            ),
            child: Text(
              "x$quantity",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}

class OrderSummary extends StatelessWidget {
  final int subtotal;
  final int serviceFee;
  final int total;

  const OrderSummary({
    super.key,
    required this.subtotal,
    required this.serviceFee,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        summaryRow("Subtotal", subtotal.toVND()),
        summaryRow("Service fee", serviceFee.toVND()),
        const DottedLine(
          dashColor: Colors.grey,
          dashGapLength: 4,
          dashLength: 6,
          lineThickness: 1.5,
        ),
        summaryRow("Total", total.toVND(), totalRow: true),
      ],
    );
  }

  Widget summaryRow(String title, String value, {bool totalRow = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 15,
              fontWeight: totalRow ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 15,
              fontWeight: totalRow ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}