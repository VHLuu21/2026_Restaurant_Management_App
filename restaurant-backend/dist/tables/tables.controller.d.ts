import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';
import { TableStatus } from './table.entity';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    findPublicAvailable(guestCount?: string): Promise<import("./table.entity").RestaurantTable[]>;
    create(dto: CreateTableDto): Promise<import("./table.entity").RestaurantTable>;
    findAll(): Promise<import("./table.entity").RestaurantTable[]>;
    findOne(id: number): Promise<import("./table.entity").RestaurantTable>;
    update(id: number, dto: UpdateTableDto): Promise<import("./table.entity").RestaurantTable>;
    setStatus(id: number, status: TableStatus): Promise<import("./table.entity").RestaurantTable>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
