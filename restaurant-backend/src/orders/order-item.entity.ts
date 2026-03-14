import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Dish } from '../menu/dishes/dish.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    dishId: number;

    @ManyToOne(() => Dish, { eager: true, nullable: true })
    @JoinColumn({ name: 'dishId' })
    dish: Dish;

    @Column({ type: 'varchar', length: 150 })
    dishName: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
    })
    unitPrice: number;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
    })
    lineTotal: number;
}