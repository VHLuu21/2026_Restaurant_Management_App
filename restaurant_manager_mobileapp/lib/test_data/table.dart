import 'package:restaurant_manager_mobileapp/test_data/table_item.dart';

class TableData {
  static final List<String> status = ["Fully Booked", "Available"];
  static final List<int> floors = [1, 2, 3];

  static final List<TableItem> table = [
    TableItem(
      id: 1,
      floor: 1,
      numberOfTable: '1',
      tableSeat: 5,
      tableStatus: 'Available',
    ),
    TableItem(
      id: 2,
      floor: 1,
      numberOfTable: '2',
      tableSeat: 5,
      tableStatus: 'Fully Booked',
    ),
    TableItem(
      id: 3,
      floor: 2,
      numberOfTable: '3',
      tableSeat: 5,
      tableStatus: 'Fully Booked',
    ),
    TableItem(
      id: 4,
      floor: 1,
      numberOfTable: '4',
      tableSeat: 5,
      tableStatus: 'Available',
    ),
    TableItem(
      id: 5,
      floor: 3,
      numberOfTable: '5',
      tableSeat: 5,
      tableStatus: 'Fully Booked',
    ),
  ];
}
