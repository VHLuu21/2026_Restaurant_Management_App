import { TableStatus } from '../table.entity';
export declare class CreateTableDto {
    tableNumber: string;
    capacity: number;
    status?: TableStatus;
    area?: string;
    positionX?: number;
    positionY?: number;
}
