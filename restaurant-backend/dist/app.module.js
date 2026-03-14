"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const realtime_module_1 = require("./realtime/realtime.module");
const users_module_1 = require("./users/users.module");
const tables_module_1 = require("./tables/tables.module");
const reservations_module_1 = require("./reservations/reservations.module");
const categories_module_1 = require("./menu/categories/categories.module");
const dishes_module_1 = require("./menu/dishes/dishes.module");
const orders_module_1 = require("./orders/orders.module");
const user_entity_1 = require("./users/user.entity");
const table_entity_1 = require("./tables/table.entity");
const reservation_entity_1 = require("./reservations/reservation.entity");
const category_entity_1 = require("./menu/categories/category.entity");
const dish_entity_1 = require("./menu/dishes/dish.entity");
const order_entity_1 = require("./orders/order.entity");
const order_item_entity_1 = require("./orders/order-item.entity");
const otp_entity_1 = require("./otp/otp.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: Number(configService.get('DB_PORT')),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [
                        user_entity_1.User,
                        table_entity_1.RestaurantTable,
                        reservation_entity_1.Reservation,
                        category_entity_1.MenuCategory,
                        dish_entity_1.Dish,
                        order_entity_1.Order,
                        order_item_entity_1.OrderItem,
                        otp_entity_1.OtpCode,
                    ],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            realtime_module_1.RealtimeModule,
            users_module_1.UsersModule,
            tables_module_1.TablesModule,
            reservations_module_1.ReservationsModule,
            categories_module_1.CategoriesModule,
            dishes_module_1.DishesModule,
            orders_module_1.OrdersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map