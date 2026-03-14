import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

class ReservationSocketService {
  static io.Socket? _socket;

  static void connect({
    required int reservationId,
    required void Function(Map<String, dynamic>) onStatusChanged,
  }) {
    final socketUrl = dotenv.env['SOCKET_URL'] ?? '';

    _socket?.disconnect();
    _socket?.dispose();

    _socket = io.io(
      socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      _socket!.emit('join-reservation-room', {'reservationId': reservationId});
    });

    _socket!.on('reservation-status-changed', (data) {
      if (data is Map) {
        onStatusChanged(Map<String, dynamic>.from(data));
      }
    });
  }

  static void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
