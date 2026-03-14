import { Repository } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { RestaurantTable, TableStatus } from './table.entity';
export declare class TablesService {
    private readonly tableRepository;
    private readonly realtimeGateway;
    constructor(tableRepository: Repository<RestaurantTable>, realtimeGateway: RealtimeGateway);
    create(dto: CreateTableDto): Promise<RestaurantTable>;
    findAll(): Promise<RestaurantTable[]>;
    findOne(id: number): Promise<RestaurantTable>;
    update(id: number, dto: UpdateTableDto): Promise<RestaurantTable>;
    remove(id: number): Promise<{
        message: string;
    }>;
    setStatus(id: number, status: TableStatus): Promise<RestaurantTable>;
    findAvailableTable(guestCount: number): Promise<RestaurantTable>;
    findAvailableTables(guestCount?: number): Promise<RestaurantTable[]>;
}
