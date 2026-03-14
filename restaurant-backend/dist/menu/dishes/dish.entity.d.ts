import { MenuCategory } from '../categories/category.entity';
export declare class Dish {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isAvailable: boolean;
    categoryId: number;
    category: MenuCategory;
    createdAt: Date;
    updatedAt: Date;
}
