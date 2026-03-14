import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationStatus } from './reservation.entity';
import { ReservationsService } from './reservations.service';
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    create(@Body() dto: CreateReservationDto) {
        return this.reservationsService.create(dto);
    }

    @Get('public/status/:id')
    findPublicStatus(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.findPublicStatus(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('status') status?: ReservationStatus) {
        return this.reservationsService.findAll(status);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.reservationsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReservationStatusDto,
    ) {
        return this.reservationsService.updateStatus(id, dto);
    }
}