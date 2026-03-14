import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationStatus } from './reservation.entity';
import { ReservationsService } from './reservations.service';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(dto: CreateReservationDto): Promise<import("./reservation.entity").Reservation>;
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
    findAll(status?: ReservationStatus): Promise<import("./reservation.entity").Reservation[]>;
    findOne(id: number): Promise<import("./reservation.entity").Reservation>;
    updateStatus(id: number, dto: UpdateReservationStatusDto): Promise<import("./reservation.entity").Reservation>;
}
