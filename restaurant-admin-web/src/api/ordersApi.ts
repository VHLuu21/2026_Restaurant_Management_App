import api from './axios';
import type { Order, OrderStatus } from '../types';

export async function getOrders(status?: OrderStatus) {
    const response = await api.get<Order[]>('/orders', {
        params: status ? { status } : undefined,
    });
    return response.data;
}

export async function updateOrderStatus(
    id: number,
    payload: {
        status: OrderStatus;
        note?: string;
    },
) {
    const response = await api.patch<Order>(`/orders/${id}/status`, payload);
    return response.data;
}