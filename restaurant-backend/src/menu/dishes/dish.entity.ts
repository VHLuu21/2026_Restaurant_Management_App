import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { MenuCategory } from '../categories/category.entity';

@Entity('dishes')
export class Dish {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string | null;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
    })
    price: number;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    })
    imageUrl?: string | null;

    @Column({
        type: 'boolean',
        default: true,
    })
    isAvailable: boolean;

    @Column()
    categoryId: number;

    @ManyToOne(() => MenuCategory, (category) => category.dishes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'categoryId' })
    category: MenuCategory;

    @CreateDateColumn({
        type: 'datetime',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
    })
    updatedAt: Date;
}