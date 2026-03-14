import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RestaurantTable } from '../tables/table.entity';

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'datetime' })
    reservationTime: Date;

    @Column({ type: 'int' })
    guestCount: number;

    @Column({ nullable: true, type: 'text' })
    note: string;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    })
    status: ReservationStatus;

    @Column({ nullable: true, type: 'text' })
    adminNote: string;

    @ManyToOne(() => RestaurantTable, { nullable: true, eager: true })
    @JoinColumn({ name: 'tableId' })
    table: RestaurantTable;

    @Column({ nullable: true })
    tableId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}