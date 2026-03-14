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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const table_entity_1 = require("./table.entity");
let TablesService = class TablesService {
    constructor(tableRepository, realtimeGateway) {
        this.tableRepository = tableRepository;
        this.realtimeGateway = realtimeGateway;
    }
    async create(dto) {
        const table = this.tableRepository.create({
            ...dto,
            status: dto.status || table_entity_1.TableStatus.AVAILABLE,
        });
        const saved = await this.tableRepository.save(table);
        this.realtimeGateway.emitTableUpdated({
            action: 'CREATED',
            table: saved,
        });
        this.realtimeGateway.emitDashboardUpdated({
            reason: 'TABLE_CREATED',
        });
        return saved;
    }
    findAll() {
        return this.tableRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id) {
        const table = await this.tableRepository.findOne({ where: { id } });
        if (!table)
            throw new common_1.NotFoundException('Không tìm thấy bàn');
        return table;
    }
    async update(id, dto) {
        const table = await this.findOne(id);
        Object.assign(table, dto);
        const saved = await this.tableRepository.save(table);
        this.realtimeGateway.emitTableUpdated({
            action: 'UPDATED',
            table: saved,
        });
        this.realtimeGateway.emitDashboardUpdated({
            reason: 'TABLE_UPDATED',
        });
        return saved;
    }
    async remove(id) {
        const table = await this.findOne(id);
        await this.tableRepository.remove(table);
        this.realtimeGateway.emitTableUpdated({
            action: 'DELETED',
            table: { id: table.id },
        });
        this.realtimeGateway.emitDashboardUpdated({
            reason: 'TABLE_DELETED',
        });
        return { message: 'Xóa bàn thành công' };
    }
    async setStatus(id, status) {
        const table = await this.findOne(id);
        table.status = status;
        const saved = await this.tableRepository.save(table);
        this.realtimeGateway.emitTableUpdated({
            action: 'STATUS_CHANGED',
            table: saved,
        });
        this.realtimeGateway.emitDashboardUpdated({
            reason: 'TABLE_STATUS_CHANGED',
        });
        return saved;
    }
    async findAvailableTable(guestCount) {
        return this.tableRepository
            .createQueryBuilder('table')
            .where('table.status = :status', { status: table_entity_1.TableStatus.AVAILABLE })
            .andWhere('table.capacity >= :guestCount', { guestCount })
            .orderBy('table.capacity', 'ASC')
            .getOne();
    }
    async findAvailableTables(guestCount) {
        const qb = this.tableRepository
            .createQueryBuilder('table')
            .where('table.status = :status', { status: table_entity_1.TableStatus.AVAILABLE })
            .orderBy('table.capacity', 'ASC');
        if (guestCount && guestCount > 0) {
            qb.andWhere('table.capacity >= :guestCount', { guestCount });
        }
        return qb.getMany();
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(table_entity_1.RestaurantTable)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], TablesService);
//# sourceMappingURL=tables.service.js.map