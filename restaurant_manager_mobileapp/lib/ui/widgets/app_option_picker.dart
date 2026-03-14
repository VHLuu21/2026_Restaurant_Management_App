import 'package:flutter/material.dart';
import 'package:restaurant_manager_mobileapp/ui/models/option_item.dart';

Future<T?> showOptionPicker<T>({
  required BuildContext context,
  required List<OptionItem<T>> options,
  required T selectedValue,
}) {
  return showModalBottomSheet<T>(
    context: context,
    backgroundColor: Colors.transparent,
    builder: (_) =>
        _OptionPickerSheet<T>(options: options, selectedValue: selectedValue),
  );
}

class _OptionPickerSheet<T> extends StatefulWidget {
  final List<OptionItem<T>> options;
  final T selectedValue;

  const _OptionPickerSheet({
    required this.options,
    required this.selectedValue,
  });

  @override
  State<_OptionPickerSheet<T>> createState() => _OptionPickerSheetState<T>();
}

class _OptionPickerSheetState<T> extends State<_OptionPickerSheet<T>> {
  late T currentValue;

  @override
  void initState() {
    super.initState();
    currentValue = widget.selectedValue;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
        decoration: BoxDecoration(
          color: const Color(0xFFEFE9DD),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.black12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // drag handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(2),
              ),
            ),

            //List option
            ...widget.options.map((e) {
              return RadioMenuButton<T>(
                value: e.value,
                groupValue: currentValue,
                onChanged: (v) {
                  if (v != null) {
                    Navigator.pop(context, v);
                  }
                },
                child: Text(e.label, style: const TextStyle(fontSize: 16)),
              );
            }),
          ],
        ),
      ),
    );
  }
}
