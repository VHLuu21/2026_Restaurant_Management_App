import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Socket connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket disconnected: ${client.id}`);
    }

    @SubscribeMessage('join-admin-room')
    handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
        client.join('admin-room');
        return {
            event: 'joined-admin-room',
            data: {
                clientId: client.id,
                room: 'admin-room',
            },
        };
    }

    @SubscribeMessage('join-reservation-room')
    handleJoinReservationRoom(
        @MessageBody() data: { reservationId: number },
        @ConnectedSocket() client: Socket,
    ) {
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

    emitReservationCreated(payload: any) {
        this.server.to('admin-room').emit('reservation-created', payload);
    }

    emitReservationUpdated(payload: any) {
        this.server.to('admin-room').emit('reservation-updated', payload);
    }

    emitTableUpdated(payload: any) {
        this.server.to('admin-room').emit('table-updated', payload);
    }

    emitDashboardUpdated(payload: any) {
        this.server.to('admin-room').emit('dashboard-updated', payload);
    }

    emitReservationStatusForCustomer(reservationId: number, payload: any) {
        this.server
            .to(`reservation-${reservationId}`)
            .emit('reservation-status-changed', payload);
    }
    emitOrderCreated(payload: any) {
        this.server.to('admin-room').emit('order-created', payload);
    }

    emitOrderUpdated(payload: any) {
        this.server.to('admin-room').emit('order-updated', payload);
    }
}