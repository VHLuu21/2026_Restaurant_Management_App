import 'dart:async';
import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/test_data/food.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';
import 'package:restaurant_manager_mobileapp/theme/app_fonts.dart';

class FoodSlider extends StatefulWidget {
  const FoodSlider({super.key});

  @override
  State<FoodSlider> createState() => _FoodSliderState();
}

class _FoodSliderState extends State<FoodSlider> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _timer;
  int foodusImages = FoodData.foodus.length;

  @override
  void initState() {
    super.initState();

    _timer = Timer.periodic(const Duration(seconds: 3), (Timer timer) {
      if (_currentPage < foodusImages - 1) {
        _currentPage++;
      } else {
        _currentPage = 0;
      }

      _pageController.animateToPage(
        _currentPage,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeIn,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Slider
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _pageController,
            itemCount: foodusImages,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemBuilder: (context, index) {
              return ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Stack(
                  children: [
                    Image.asset(
                      FoodData.foodus[index].image,
                      fit: BoxFit.cover,
                      width: double.infinity,
                    ),
                    // Name dish
                    Positioned(
                      bottom: 20,
                      left: 10,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            FoodData.foodus[index].name,
                            style: TextStyle(
                              color: Colors.white,
                              fontFamily: AppFonts.lobster,
                              fontSize: 16,
                            ),
                          ),
                          // Description dish
                          Text(
                            FoodData.foodus[index].desc,
                            overflow: TextOverflow.ellipsis,
                            maxLines: 2,
                            style: TextStyle(
                              color: const Color.fromARGB(255, 192, 192, 192),
                              fontFamily: AppFonts.lobster,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Rating
                    Positioned(
                      bottom: 30,
                      right: 10,
                      child: Container(
                        width: 50,
                        height: 25,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                        ),
                        child: Row(
                          children: [
                            SizedBox(width: 2,),
                            Icon(Icons.star, color: Colors.amber, size: 14),
                            SizedBox(width: 5),
                            Text(
                              FoodData.foodus[index].rating.toString(),
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                fontFamily: AppFonts.roboto,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 8),

        // Indicator
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(foodusImages, (index) => buildDot(index)),
        ),
      ],
    );
  }

  Widget buildDot(int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      width: _currentPage == index ? 20 : 8,
      height: _currentPage == index ? 8 : 8,
      decoration: BoxDecoration(
        color: _currentPage == index ? AppColors.general : AppColors.dot,
        shape: BoxShape.rectangle,
        borderRadius: BorderRadius.circular(15),
      ),
    );
  }
}
