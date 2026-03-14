class TableItem {
  final int id;
  final int floor;
  final String numberOfTable;
  final String tableStatus;
  final int tableSeat;
  final String? area;

  TableItem({
    required this.id,
    required this.floor,
    required this.numberOfTable,
    required this.tableSeat,
    required this.tableStatus,
    this.area,
  });

  factory TableItem.fromApi(Map<String, dynamic> json) {
    final rawArea = (json['area'] ?? '').toString();
    final status = (json['status'] ?? '').toString().toUpperCase();

    return TableItem(
      id: int.tryParse(json['id'].toString()) ?? 0,
      floor: _extractFloor(rawArea),
      numberOfTable: (json['tableNumber'] ?? '').toString(),
      tableSeat: int.tryParse(json['capacity'].toString()) ?? 0,
      tableStatus: status == 'AVAILABLE' ? 'Available' : 'Fully Booked',
      area: rawArea.isEmpty ? null : rawArea,
    );
  }

  static int _extractFloor(String value) {
    final match = RegExp(r'(\d+)').firstMatch(value);
    if (match == null) return 1;
    return int.tryParse(match.group(1)!) ?? 1;
  }
}
