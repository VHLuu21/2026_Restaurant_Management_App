import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ReservationStatus } from '../reservation.entity';

export class UpdateReservationStatusDto {
    @IsEnum(ReservationStatus)
    status: ReservationStatus;

    @IsOptional()
    @IsInt()
    tableId?: number;

    @IsOptional()
    @IsString()
    adminNote?: string;
}