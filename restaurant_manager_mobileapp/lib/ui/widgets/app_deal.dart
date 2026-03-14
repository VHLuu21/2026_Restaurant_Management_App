import 'package:flutter/material.dart';

class AppDeal extends StatelessWidget {
  const AppDeal({super.key});

  @override
  Widget build(BuildContext context) {
    final List<String> dealImages = [
      'assets/imgs/test/deal1.png',
      'assets/imgs/test/deal2.png',
      'assets/imgs/test/deal3.png',
    ];
    return SizedBox(
      height: 200,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 1),
        itemCount: dealImages.length,
        itemBuilder: (context, index){
          final deal = dealImages[index];
          return Container(
            margin: const EdgeInsets.only(left: 14),
            width: 150,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.asset(deal, fit: BoxFit.cover,),
            ),
          );
        },
      ),
    );
  }
}
