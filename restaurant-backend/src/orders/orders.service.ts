import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../menu/dishes/dish.entity';
import {
    Reservation,
    ReservationStatus,
} from '../reservations/reservation.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>,
        private readonly realtimeGateway: RealtimeGateway,
    ) { }

    async create(dto: CreateOrderDto) {
        const reservation = await this.reservationRepository.findOne({
            where: { id: dto.reservationId },
            relations: ['table'],
        });

        if (!reservation) {
            throw new NotFoundException('Không tìm thấy reservation');
        }

        if (
            reservation.status === ReservationStatus.REJECTED ||
            reservation.status === ReservationStatus.CANCELLED
        ) {
            throw new BadRequestException('Reservation này không thể gọi món');
        }

        const builtItems: OrderItem[] = [];
        let totalAmount = 0;

        for (const rawItem of dto.items) {
            const dish = await this.dishRepository.findOne({
                where: { id: rawItem.dishId },
                relations: ['category'],
            });

            if (!dish) {
                throw new NotFoundException(`Không tìm thấy món #${rawItem.dishId}`);
            }

            if (!dish.isAvailable) {
                throw new BadRequestException(`Món ${dish.name} hiện không khả dụng`);
            }

            const unitPrice = Number(dish.price);
            const lineTotal = unitPrice * rawItem.quantity;

            totalAmount += lineTotal;

            const item = this.orderItemRepository.create({
                dishId: dish.id,
                dishName: dish.name,
                unitPrice,
                quantity: rawItem.quantity,
                lineTotal,
            });

            builtItems.push(item);
        }

        const order = this.orderRepository.create({
            reservationId: reservation.id,
            note: dto.note,
            totalAmount,
            status: OrderStatus.PENDING,
            items: builtItems,
        });

        const saved = await this.orderRepository.save(order);
        const hydrated = await this.findOne(saved.id);

        this.realtimeGateway.emitOrderCreated({
            action: 'CREATED',
            order: hydrated,
        });

        this.realtimeGateway.emitDashboardUpdated({
            reason: 'ORDER_CREATED',
        });

        return hydrated;
    }

    findAll(status?: OrderStatus) {
        if (status) {
            return this.orderRepository.find({
                where: { status },
                order: { createdAt: 'DESC' },
            });
        }

        return this.orderRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'items',
                'items.dish',
                'reservation',
                'reservation.table',
            ],
        });

        if (!order) {
            throw new NotFoundException('Không tìm thấy order');
        }

        return order;
    }

    async updateStatus(id: number, dto: UpdateOrderStatusDto) {
        const order = await this.findOne(id);

        order.status = dto.status;
        if (dto.note !== undefined) {
            order.note = dto.note;
        }

        const saved = await this.orderRepository.save(order);
        const hydrated = await this.findOne(saved.id);

        this.realtimeGateway.emitOrderUpdated({
            action: 'STATUS_CHANGED',
            order: hydrated,
        });

        this.realtimeGateway.emitDashboardUpdated({
            reason: 'ORDER_UPDATED',
        });

        return hydrated;
    }

    async findByReservation(reservationId: number) {
        const order = await this.orderRepository.findOne({
            where: { reservationId },
            relations: [
                'items',
                'items.dish',
                'reservation',
                'reservation.table',
            ],
            order: { createdAt: 'DESC' },
        });

        return order;
    }
}