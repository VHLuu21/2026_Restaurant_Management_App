import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { RestaurantTable, TableStatus } from './table.entity';

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(RestaurantTable)
        private readonly tableRepository: Repository<RestaurantTable>,
        private readonly realtimeGateway: RealtimeGateway,
    ) { }

    async create(dto: CreateTableDto) {
        const table = this.tableRepository.create({
            ...dto,
            status: dto.status || TableStatus.AVAILABLE,
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

    async findOne(id: number) {
        const table = await this.tableRepository.findOne({ where: { id } });
        if (!table) throw new NotFoundException('Không tìm thấy bàn');
        return table;
    }

    async update(id: number, dto: UpdateTableDto) {
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

    async remove(id: number) {
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

    async setStatus(id: number, status: TableStatus) {
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

    async findAvailableTable(guestCount: number) {
        return this.tableRepository
            .createQueryBuilder('table')
            .where('table.status = :status', { status: TableStatus.AVAILABLE })
            .andWhere('table.capacity >= :guestCount', { guestCount })
            .orderBy('table.capacity', 'ASC')
            .getOne();
    }

    async findAvailableTables(guestCount?: number) {
        const qb = this.tableRepository
            .createQueryBuilder('table')
            .where('table.status = :status', { status: TableStatus.AVAILABLE })
            .orderBy('table.capacity', 'ASC');

        if (guestCount && guestCount > 0) {
            qb.andWhere('table.capacity >= :guestCount', { guestCount });
        }

        return qb.getMany();
    }
}