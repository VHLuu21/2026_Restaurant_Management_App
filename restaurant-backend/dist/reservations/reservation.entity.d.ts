import { RestaurantTable } from '../tables/table.entity';
export declare enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class Reservation {
    id: number;
    customerName: string;
    phone: string;
    email: string;
    reservationTime: Date;
    guestCount: number;
    note: string;
    status: ReservationStatus;
    adminNote: string;
    table: RestaurantTable;
    tableId: number;
    createdAt: Date;
    updatedAt: Date;
}
