import { Reservation } from '../reservations/reservation.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    SERVED = "SERVED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: number;
    reservationId: number;
    reservation: Reservation;
    status: OrderStatus;
    totalAmount: number;
    note?: string | null;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
