import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TableStatus {
    AVAILABLE = 'AVAILABLE',
    RESERVED = 'RESERVED',
    OCCUPIED = 'OCCUPIED',
    UNAVAILABLE = 'UNAVAILABLE',
}

@Entity('restaurant_tables')
export class RestaurantTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    tableNumber: string;

    @Column({ type: 'int' })
    capacity: number;

    @Column({
        type: 'enum',
        enum: TableStatus,
        default: TableStatus.AVAILABLE,
    })
    status: TableStatus;

    @Column({ nullable: true })
    area: string;

    @Column({ type: 'int', default: 0 })
    positionX: number;

    @Column({ type: 'int', default: 0 })
    positionY: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}