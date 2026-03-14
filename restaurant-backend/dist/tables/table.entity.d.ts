export declare enum TableStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
    OCCUPIED = "OCCUPIED",
    UNAVAILABLE = "UNAVAILABLE"
}
export declare class RestaurantTable {
    id: number;
    tableNumber: string;
    capacity: number;
    status: TableStatus;
    area: string;
    positionX: number;
    positionY: number;
    createdAt: Date;
    updatedAt: Date;
}
