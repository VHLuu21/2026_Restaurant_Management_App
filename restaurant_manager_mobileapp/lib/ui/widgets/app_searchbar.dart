import 'dart:async';
import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/theme/app_colors.dart';

class AppSearchBar extends StatefulWidget {
  final String hintText;
  final List<String>? rotatingHints;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool autofocus;
  final EdgeInsetsGeometry? margin;
  final Duration debounceDuration;

  const AppSearchBar({
    super.key,
    this.hintText = "Search",
    this.rotatingHints,
    this.controller,
    this.onChanged,
    this.autofocus = false,
    this.margin,
    this.debounceDuration = const Duration(milliseconds: 300),
  });

  @override
  State<AppSearchBar> createState() => _AppSearchBarState();
}

class _AppSearchBarState extends State<AppSearchBar> {
  late final TextEditingController _controller;
  Timer? _debounce;
  Timer? _hintTimer;
  int _hintIndex = 0;

  OutlineInputBorder _border(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(24),
      borderSide: BorderSide(color: color),
    );
  }

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();

    _controller.addListener(() {
      setState(() {});
    });

    // rotating hint timer
    if (widget.rotatingHints != null && widget.rotatingHints!.isNotEmpty) {
      _hintTimer = Timer.periodic(const Duration(seconds: 3), (_) {
        if (!mounted) return;
        setState(() {
          _hintIndex = (_hintIndex + 1) % widget.rotatingHints!.length;
        });
      });
    }
  }

  void _onChanged(String value) {
    if (widget.onChanged == null) return;

    _debounce?.cancel();
    _debounce = Timer(widget.debounceDuration, () {
      widget.onChanged!(value);
    });
  }

  void _clear() {
    _controller.clear();
    widget.onChanged?.call("");
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _hintTimer?.cancel();
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  String get _currentHint {
    if (widget.rotatingHints != null && widget.rotatingHints!.isNotEmpty) {
      return widget.rotatingHints![_hintIndex];
    }
    return widget.hintText;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: widget.margin,
      child: Stack(
        alignment: Alignment.centerLeft,
        children: [
          TextField(
            controller: _controller,
            autofocus: widget.autofocus,
            onChanged: _onChanged,
            onTapOutside: (_) => FocusScope.of(context).unfocus(),
            style: const TextStyle(color: Colors.black),
            decoration: InputDecoration(
              hintText: "",

              filled: true,
              fillColor: const Color.fromARGB(45, 226, 220, 220),
              prefixIcon: const Icon(Icons.search, color: Colors.black),

              suffixIcon: _controller.text.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.clear), onPressed: _clear)
                  : null,

              border: _border(AppColors.primary),
              enabledBorder: _border(AppColors.primary),
              focusedBorder: _border(AppColors.primary),
            ),
          ),

          // Hint overlay
          Positioned(
            left: 20,
            right: 180,
            child: IgnorePointer(
              child: _controller.text.isEmpty
                  ? AnimatedSwitcher(
                      duration: const Duration(milliseconds: 400),
                      transitionBuilder: (child, animation) {
                        final offsetAnimation = Tween<Offset>(
                          begin: const Offset(0, 0.6),
                          end: Offset.zero,
                        ).animate(animation);

                        return SlideTransition(
                          position: offsetAnimation,
                          child: FadeTransition(
                            opacity: animation,
                            child: child,
                          ),
                        );
                      },
                      child: Text(
                        _currentHint,
                        key: ValueKey(_currentHint),
                        style: TextStyle(
                          color: AppColors.general,
                          fontSize: 14,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ),
        ],
      ),
    );
  }
}
