import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeModule } from '../realtime/realtime.module';
import { TablesModule } from '../tables/tables.module';
import { Reservation } from './reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation]), TablesModule, RealtimeModule],
    controllers: [ReservationsController],
    providers: [ReservationsService],
})
export class ReservationsModule { }