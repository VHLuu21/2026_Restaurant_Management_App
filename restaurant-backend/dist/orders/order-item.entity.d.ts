import { Dish } from '../menu/dishes/dish.entity';
import { Order } from './order.entity';
export declare class OrderItem {
    id: number;
    orderId: number;
    order: Order;
    dishId: number;
    dish: Dish;
    dishName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}
