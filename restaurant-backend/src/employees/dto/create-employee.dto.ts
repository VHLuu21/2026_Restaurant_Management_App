import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEmail
} from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @IsOptional()
  @IsString()
  note?: string;
}