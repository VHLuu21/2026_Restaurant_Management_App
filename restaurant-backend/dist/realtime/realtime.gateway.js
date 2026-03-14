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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let RealtimeGateway = class RealtimeGateway {
    handleConnection(client) {
        console.log(`Socket connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Socket disconnected: ${client.id}`);
    }
    handleJoinAdminRoom(client) {
        client.join('admin-room');
        return {
            event: 'joined-admin-room',
            data: {
                clientId: client.id,
                room: 'admin-room',
            },
        };
    }
    handleJoinReservationRoom(data, client) {
        const room = `reservation-${data.reservationId}`;
        client.join(room);
        return {
            event: 'joined-reservation-room',
            data: {
                clientId: client.id,
                room,
            },
        };
    }
    emitReservationCreated(payload) {
        this.server.to('admin-room').emit('reservation-created', payload);
    }
    emitReservationUpdated(payload) {
        this.server.to('admin-room').emit('reservation-updated', payload);
    }
    emitTableUpdated(payload) {
        this.server.to('admin-room').emit('table-updated', payload);
    }
    emitDashboardUpdated(payload) {
        this.server.to('admin-room').emit('dashboard-updated', payload);
    }
    emitReservationStatusForCustomer(reservationId, payload) {
        this.server
            .to(`reservation-${reservationId}`)
            .emit('reservation-status-changed', payload);
    }
    emitOrderCreated(payload) {
        this.server.to('admin-room').emit('order-created', payload);
    }
    emitOrderUpdated(payload) {
        this.server.to('admin-room').emit('order-updated', payload);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-admin-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleJoinAdminRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-reservation-room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleJoinReservationRoom", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map