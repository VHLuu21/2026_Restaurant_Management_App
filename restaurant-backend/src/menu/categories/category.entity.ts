import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Dish } from '../dishes/dish.entity';

@Entity('menu_categories')
export class MenuCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description?: string | null;

    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @OneToMany(() => Dish, (dish) => dish.category)
    dishes: Dish[];

    @CreateDateColumn({
        type: 'datetime',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'datetime',
    })
    updatedAt: Date;
}