"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const tables_service_1 = require("../tables/tables.service");
const table_entity_1 = require("../tables/table.entity");
const reservation_entity_1 = require("./reservation.entity");
let ReservationsService = class ReservationsService {
    constructor(reservationRepository, tablesService, realtimeGateway) {
        this.reservationRepository = reservationRepository;
        this.tablesService = tablesService;
        this.realtimeGateway = realtimeGateway;
    }
    async releaseTableIfNeeded(tableId) {
        if (!tableId)
            return;
        await this.tablesService.setStatus(tableId, table_entity_1.TableStatus.AVAILABLE);
    }
    async create(dto) {
        let selectedTableId;
        if (dto.tableId) {
            const targetTable = await this.tablesService.findOne(dto.tableId);
            if (targetTable.status !== table_entity_1.TableStatus.AVAILABLE) {
                throw new common_1.BadRequestException('Bàn này hiện không còn trống');
            }
            if (targetTable.capacity < dto.guestCount) {
                throw new common_1.BadRequestException('Bàn này không đủ số chỗ');
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
            status: reservation_entity_1.ReservationStatus.PENDING,
            tableId: selectedTableId,
        });
        const saved = await this.reservationRepository.save(reservation);
        if (selectedTableId) {
            await this.tablesService.setStatus(selectedTableId, table_entity_1.TableStatus.RESERVED);
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
    findAll(status) {
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
    async findOne(id) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Không tìm thấy đơn đặt bàn');
        }
        return reservation;
    }
    async findPublicStatus(id) {
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
    async updateStatus(id, dto) {
        const reservation = await this.findOne(id);
        if (dto.status === reservation_entity_1.ReservationStatus.CONFIRMED) {
            if (dto.tableId && dto.tableId !== reservation.tableId) {
                const newTable = await this.tablesService.findOne(dto.tableId);
                if (newTable.status !== table_entity_1.TableStatus.AVAILABLE) {
                    throw new common_1.BadRequestException('Bàn được chọn hiện không còn trống');
                }
                if (newTable.capacity < reservation.guestCount) {
                    throw new common_1.BadRequestException('Bàn được chọn không đủ số chỗ');
                }
                if (reservation.tableId) {
                    await this.releaseTableIfNeeded(reservation.tableId);
                }
                reservation.tableId = newTable.id;
                await this.tablesService.setStatus(newTable.id, table_entity_1.TableStatus.RESERVED);
            }
            else if (!reservation.tableId) {
                const autoTable = await this.tablesService.findAvailableTable(reservation.guestCount);
                if (!autoTable) {
                    throw new common_1.BadRequestException('Không có bàn trống phù hợp');
                }
                reservation.tableId = autoTable.id;
                await this.tablesService.setStatus(autoTable.id, table_entity_1.TableStatus.RESERVED);
            }
            reservation.status = reservation_entity_1.ReservationStatus.CONFIRMED;
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
        if (dto.status === reservation_entity_1.ReservationStatus.REJECTED) {
            await this.releaseTableIfNeeded(reservation.tableId);
            reservation.status = reservation_entity_1.ReservationStatus.REJECTED;
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
        if (dto.status === reservation_entity_1.ReservationStatus.CANCELLED) {
            await this.releaseTableIfNeeded(reservation.tableId);
            reservation.status = reservation_entity_1.ReservationStatus.CANCELLED;
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
        if (dto.status === reservation_entity_1.ReservationStatus.COMPLETED) {
            await this.releaseTableIfNeeded(reservation.tableId);
            reservation.status = reservation_entity_1.ReservationStatus.COMPLETED;
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
        throw new common_1.BadRequestException('Trạng thái không hợp lệ');
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tables_service_1.TablesService,
        realtime_gateway_1.RealtimeGateway])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map