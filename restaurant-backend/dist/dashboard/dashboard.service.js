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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("../reservations/reservation.entity");
const table_entity_1 = require("../tables/table.entity");
let DashboardService = class DashboardService {
    constructor(reservationRepository, tableRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }
    async getSummary() {
        const totalTables = await this.tableRepository.count();
        const availableTables = await this.tableRepository.count({
            where: { status: table_entity_1.TableStatus.AVAILABLE },
        });
        const reservedTables = await this.tableRepository.count({
            where: { status: table_entity_1.TableStatus.RESERVED },
        });
        const pendingReservations = await this.reservationRepository.count({
            where: { status: reservation_entity_1.ReservationStatus.PENDING },
        });
        const confirmedReservations = await this.reservationRepository.count({
            where: { status: reservation_entity_1.ReservationStatus.CONFIRMED },
        });
        return {
            totalTables,
            availableTables,
            reservedTables,
            pendingReservations,
            confirmedReservations,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(table_entity_1.RestaurantTable)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map