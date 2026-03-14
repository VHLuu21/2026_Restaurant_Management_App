import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../reservations/reservation.entity';
import { RestaurantTable, TableStatus } from '../tables/table.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(RestaurantTable)
        private readonly tableRepository: Repository<RestaurantTable>,
    ) { }

    async getSummary() {
        const totalTables = await this.tableRepository.count();
        const availableTables = await this.tableRepository.count({
            where: { status: TableStatus.AVAILABLE },
        });
        const reservedTables = await this.tableRepository.count({
            where: { status: TableStatus.RESERVED },
        });
        const pendingReservations = await this.reservationRepository.count({
            where: { status: ReservationStatus.PENDING },
        });
        const confirmedReservations = await this.reservationRepository.count({
            where: { status: ReservationStatus.CONFIRMED },
        });

        return {
            totalTables,
            availableTables,
            reservedTables,
            pendingReservations,
            confirmedReservations,
        };
    }
}