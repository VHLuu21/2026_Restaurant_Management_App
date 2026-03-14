declare class CreateOrderItemDto {
    dishId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    reservationId: number;
    note?: string;
    items: CreateOrderItemDto[];
}
export {};
