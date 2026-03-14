import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { RestaurantTable } from '../tables/table.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, RestaurantTable])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }