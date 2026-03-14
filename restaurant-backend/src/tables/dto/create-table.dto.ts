import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { TableStatus } from '../table.entity';

export class CreateTableDto {
    @IsString()
    tableNumber: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsOptional()
    @IsEnum(TableStatus)
    status?: TableStatus;

    @IsOptional()
    @IsString()
    area?: string;

    @IsOptional()
    @IsInt()
    positionX?: number;

    @IsOptional()
    @IsInt()
    positionY?: number;
}