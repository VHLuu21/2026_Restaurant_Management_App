import { Repository } from 'typeorm';
import { Dish } from '../menu/dishes/dish.entity';
import { Reservation } from '../reservations/reservation.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
export declare class OrdersService {
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly reservationRepository;
    private readonly dishRepository;
    private readonly realtimeGateway;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, reservationRepository: Repository<Reservation>, dishRepository: Repository<Dish>, realtimeGateway: RealtimeGateway);
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(status?: OrderStatus): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order>;
    findByReservation(reservationId: number): Promise<Order>;
}
