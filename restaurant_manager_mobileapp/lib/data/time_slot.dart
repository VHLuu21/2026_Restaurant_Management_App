class TimeSlot {
  final String name;
  final int startHour;
  final int startMinute;
  final int endHour;
  final int endMinute;
  final String period;

  const TimeSlot({
    required this.name,
    required this.startHour,
    required this.startMinute,
    required this.endHour,
    required this.endMinute,
    required this.period,
  });
}