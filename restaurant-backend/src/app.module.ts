import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UsersModule } from './users/users.module';
import { TablesModule } from './tables/tables.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CategoriesModule } from './menu/categories/categories.module';
import { DishesModule } from './menu/dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';

import { User } from './users/user.entity';
import { RestaurantTable } from './tables/table.entity';
import { Reservation } from './reservations/reservation.entity';
import { MenuCategory } from './menu/categories/category.entity';
import { Dish } from './menu/dishes/dish.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { OtpCode } from './otp/otp.entity';
import { Employee } from './employees/employee.entity';
import { EmployeesModule } from './employees/employees.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: Number(configService.get<string>('DB_PORT')),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [
                    User,
                    RestaurantTable,
                    Reservation,
                    MenuCategory,
                    Dish,
                    Order,
                    OrderItem,
                    OtpCode,
                    Employee,
                ],
                synchronize: true,
            }),
        }),

        AuthModule,
        DashboardModule,
        RealtimeModule,
        UsersModule,
        TablesModule,
        ReservationsModule,
        CategoriesModule,
        DishesModule,
        OrdersModule,
        EmployeesModule,
    ],
})
export class AppModule { }