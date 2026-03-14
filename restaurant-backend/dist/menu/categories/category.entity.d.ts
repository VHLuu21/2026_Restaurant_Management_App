import { Dish } from '../dishes/dish.entity';
export declare class MenuCategory {
    id: number;
    name: string;
    description?: string | null;
    isActive: boolean;
    dishes: Dish[];
    createdAt: Date;
    updatedAt: Date;
}
