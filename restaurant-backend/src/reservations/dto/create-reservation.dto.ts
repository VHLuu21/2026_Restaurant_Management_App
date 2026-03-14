import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateReservationDto {
    @IsString()
    customerName: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsDateString()
    reservationTime: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    guestCount: number;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    tableId?: number;
}