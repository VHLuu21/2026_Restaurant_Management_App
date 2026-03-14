import { ReservationStatus } from '../reservation.entity';
export declare class UpdateReservationStatusDto {
    status: ReservationStatus;
    tableId?: number;
    adminNote?: string;
}
