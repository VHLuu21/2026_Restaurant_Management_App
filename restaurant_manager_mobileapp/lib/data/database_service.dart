import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mysql_client/mysql_client.dart';

class DbService {
  static Future<MySQLConnection> connect() async {
    final host = dotenv.env['DB_HOST'] ?? '';
    final port = int.tryParse(dotenv.env['DB_PORT'] ?? '') ?? 3306;
    final user = dotenv.env['DB_USER'] ?? '';
    final password = dotenv.env['DB_PASSWORD'] ?? '';
    final dbName = dotenv.env['DB_NAME'];
    final secure = (dotenv.env['DB_SECURE'] ?? 'false').toLowerCase() == 'true';

    final con = await MySQLConnection.createConnection(
      host: host,
      port: port,
      userName: user,
      password: password,
      databaseName: dbName,
      secure: secure,
    );

    await con.connect();
    return con;
  }
}
