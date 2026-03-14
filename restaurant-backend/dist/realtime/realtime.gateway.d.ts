import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinAdminRoom(client: Socket): {
        event: string;
        data: {
            clientId: string;
            room: string;
        };
    };
    handleJoinReservationRoom(data: {
        reservationId: number;
    }, client: Socket): {
        event: string;
        data: {
            clientId: string;
            room: string;
        };
    };
    emitReservationCreated(payload: any): void;
    emitReservationUpdated(payload: any): void;
    emitTableUpdated(payload: any): void;
    emitDashboardUpdated(payload: any): void;
    emitReservationStatusForCustomer(reservationId: number, payload: any): void;
    emitOrderCreated(payload: any): void;
    emitOrderUpdated(payload: any): void;
}
