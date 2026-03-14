import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TablesService } from '../tables/tables.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { Reservation, ReservationStatus } from './reservation.entity';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly tablesService;
    private readonly realtimeGateway;
    constructor(reservationRepository: Repository<Reservation>, tablesService: TablesService, realtimeGateway: RealtimeGateway);
    private releaseTableIfNeeded;
    create(dto: CreateReservationDto): Promise<Reservation>;
    findAll(status?: ReservationStatus): Promise<Reservation[]>;
    findOne(id: number): Promise<Reservation>;
    findPublicStatus(id: number): Promise<{
        id: number;
        customerName: string;
        reservationTime: Date;
        guestCount: number;
        status: ReservationStatus;
        adminNote: string;
        tableId: number;
        table: import("../tables/table.entity").RestaurantTable;
    }>;
    updateStatus(id: number, dto: UpdateReservationStatusDto): Promise<Reservation>;
}
