import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TablesService } from '../tables/tables.service';
import { TableStatus } from '../tables/table.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { Reservation, ReservationStatus } from './reservation.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        private readonly tablesService: TablesService,
        private readonly realtimeGateway: RealtimeGateway,
    ) { }

    private async releaseTableIfNeeded(tableId?: number) {
        if (!tableId) return;
        await this.tablesService.setStatus(tableId, TableStatus.AVAILABLE);
    }

    async create(dto: CreateReservationDto) {
        let selectedTableId: number | undefined;

        if (dto.tableId) {
            const targetTable = await this.tablesService.findOne(dto.tableId);

            if (targetTable.status !== TableStatus.AVAILABLE) {
                throw new BadRequestException('Bàn này hiện không còn trống');
            }

            if (targetTable.capacity < dto.guestCount) {
                throw new BadRequestException('Bàn này không đủ số chỗ');
            }

            selectedTableId = targetTable.id;
        }

        const reservation = this.reservationRepository.create({
            customerName: dto.customerName,
            phone: dto.phone,
            email: dto.email,
            reservationTime: new Date(dto.reservationTime),
            guestCount: dto.guestCount,
            note: dto.note,
            status: ReservationStatus.PENDING,
            tableId: selectedTableId,
        });

        const saved = await this.reservationRepository.save(reservation);

        if (selectedTableId) {
            await this.tablesService.setStatus(selectedTableId, TableStatus.RESERVED);
        }

        const hydrated = await this.findOne(saved.id);

        this.realtimeGateway.emitReservationCreated({
            action: 'CREATED',
            reservation: hydrated,
        });

        this.realtimeGateway.emitDashboardUpdated({
            reason: 'RESERVATION_CREATED',
        });

        this.realtimeGateway.emitReservationStatusForCustomer(hydrated.id, {
            action: 'CREATED',
            reservation: hydrated,
        });

        return hydrated;
    }

    findAll(status?: ReservationStatus) {
        if (status) {
            return this.reservationRepository.find({
                where: { status },
                order: { reservationTime: 'DESC' },
            });
        }

        return this.reservationRepository.find({
            order: { reservationTime: 'DESC' },
        });
    }

    async findOne(id: number) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
        });

        if (!reservation) {
            throw new NotFoundException('Không tìm thấy đơn đặt bàn');
        }

        return reservation;
    }

    async findPublicStatus(id: number) {
        const reservation = await this.findOne(id);

        return {
            id: reservation.id,
            customerName: reservation.customerName,
            reservationTime: reservation.reservationTime,
            guestCount: reservation.guestCount,
            status: reservation.status,
            adminNote: reservation.adminNote,
            tableId: reservation.tableId,
            table: reservation.table,
        };
    }

    async updateStatus(id: number, dto: UpdateReservationStatusDto) {
        const reservation = await this.findOne(id);

        if (dto.status === ReservationStatus.CONFIRMED) {
            if (dto.tableId && dto.tableId !== reservation.tableId) {
                const newTable = await this.tablesService.findOne(dto.tableId);

                if (newTable.status !== TableStatus.AVAILABLE) {
                    throw new BadRequestException('Bàn được chọn hiện không còn trống');
                }

                if (newTable.capacity < reservation.guestCount) {
                    throw new BadRequestException('Bàn được chọn không đủ số chỗ');
                }

                if (reservation.tableId) {
                    await this.releaseTableIfNeeded(reservation.tableId);
                }

                reservation.tableId = newTable.id;
                await this.tablesService.setStatus(newTable.id, TableStatus.RESERVED);
            } else if (!reservation.tableId) {
                const autoTable = await this.tablesService.findAvailableTable(
                    reservation.guestCount,
                );

                if (!autoTable) {
                    throw new BadRequestException('Không có bàn trống phù hợp');
                }

                reservation.tableId = autoTable.id;
                await this.tablesService.setStatus(autoTable.id, TableStatus.RESERVED);
            }

            reservation.status = ReservationStatus.CONFIRMED;
            reservation.adminNote = dto.adminNote;

            const saved = await this.reservationRepository.save(reservation);
            const hydrated = await this.findOne(saved.id);

            this.realtimeGateway.emitReservationUpdated({
                action: 'CONFIRMED',
                reservation: hydrated,
            });

            this.realtimeGateway.emitDashboardUpdated({
                reason: 'RESERVATION_CONFIRMED',
            });

            this.realtimeGateway.emitReservationStatusForCustomer(hydrated.id, {
                action: 'CONFIRMED',
                reservation: hydrated,
            });

            return hydrated;
        }

        if (dto.status === ReservationStatus.REJECTED) {
            await this.releaseTableIfNeeded(reservation.tableId);

            reservation.status = ReservationStatus.REJECTED;
            reservation.adminNote = dto.adminNote;

            const saved = await this.reservationRepository.save(reservation);
            const hydrated = await this.findOne(saved.id);

            this.realtimeGateway.emitReservationUpdated({
                action: 'REJECTED',
                reservation: hydrated,
            });

            this.realtimeGateway.emitDashboardUpdated({
                reason: 'RESERVATION_REJECTED',
            });

            this.realtimeGateway.emitReservationStatusForCustomer(hydrated.id, {
                action: 'REJECTED',
                reservation: hydrated,
            });

            return hydrated;
        }

        if (dto.status === ReservationStatus.CANCELLED) {
            await this.releaseTableIfNeeded(reservation.tableId);

            reservation.status = ReservationStatus.CANCELLED;
            reservation.adminNote = dto.adminNote;

            const saved = await this.reservationRepository.save(reservation);
            const hydrated = await this.findOne(saved.id);

            this.realtimeGateway.emitReservationUpdated({
                action: 'CANCELLED',
                reservation: hydrated,
            });

            this.realtimeGateway.emitDashboardUpdated({
                reason: 'RESERVATION_CANCELLED',
            });

            this.realtimeGateway.emitReservationStatusForCustomer(hydrated.id, {
                action: 'CANCELLED',
                reservation: hydrated,
            });

            return hydrated;
        }

        if (dto.status === ReservationStatus.COMPLETED) {
            await this.releaseTableIfNeeded(reservation.tableId);

            reservation.status = ReservationStatus.COMPLETED;
            reservation.adminNote = dto.adminNote;

            const saved = await this.reservationRepository.save(reservation);
            const hydrated = await this.findOne(saved.id);

            this.realtimeGateway.emitReservationUpdated({
                action: 'COMPLETED',
                reservation: hydrated,
            });

            this.realtimeGateway.emitDashboardUpdated({
                reason: 'RESERVATION_COMPLETED',
            });

            this.realtimeGateway.emitReservationStatusForCustomer(hydrated.id, {
                action: 'COMPLETED',
                reservation: hydrated,
            });

            return hydrated;
        }

        throw new BadRequestException('Trạng thái không hợp lệ');
    }
}