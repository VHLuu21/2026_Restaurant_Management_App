import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    dishId: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    reservationId: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}