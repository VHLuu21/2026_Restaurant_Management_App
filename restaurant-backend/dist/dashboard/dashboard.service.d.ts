import { Repository } from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { RestaurantTable } from '../tables/table.entity';
export declare class DashboardService {
    private readonly reservationRepository;
    private readonly tableRepository;
    constructor(reservationRepository: Repository<Reservation>, tableRepository: Repository<RestaurantTable>);
    getSummary(): Promise<{
        totalTables: number;
        availableTables: number;
        reservedTables: number;
        pendingReservations: number;
        confirmedReservations: number;
    }>;
}
