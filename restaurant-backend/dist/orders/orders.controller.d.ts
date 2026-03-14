import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './order.entity';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("./order.entity").Order>;
    findAll(status?: OrderStatus): Promise<import("./order.entity").Order[]>;
    findOne(id: number): Promise<import("./order.entity").Order>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    findByReservation(reservationId: number): Promise<import("./order.entity").Order>;
}
