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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dish_entity_1 = require("../menu/dishes/dish.entity");
const reservation_entity_1 = require("../reservations/reservation.entity");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, reservationRepository, dishRepository, realtimeGateway) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.reservationRepository = reservationRepository;
        this.dishRepository = dishRepository;
        this.realtimeGateway = realtimeGateway;
    }
    async create(dto) {
        const reservation = await this.reservationRepository.findOne({
            where: { id: dto.reservationId },
            relations: ['table'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Không tìm thấy reservation');
        }
        if (reservation.status === reservation_entity_1.ReservationStatus.REJECTED ||
            reservation.status === reservation_entity_1.ReservationStatus.CANCELLED) {
            throw new common_1.BadRequestException('Reservation này không thể gọi món');
        }
        const builtItems = [];
        let totalAmount = 0;
        for (const rawItem of dto.items) {
            const dish = await this.dishRepository.findOne({
                where: { id: rawItem.dishId },
                relations: ['category'],
            });
            if (!dish) {
                throw new common_1.NotFoundException(`Không tìm thấy món #${rawItem.dishId}`);
            }
            if (!dish.isAvailable) {
                throw new common_1.BadRequestException(`Món ${dish.name} hiện không khả dụng`);
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
            status: order_entity_1.OrderStatus.PENDING,
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
    findAll(status) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Không tìm thấy order');
        }
        return order;
    }
    async updateStatus(id, dto) {
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
    async findByReservation(reservationId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(3, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map