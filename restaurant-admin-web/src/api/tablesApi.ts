import api from './axios';
import type { RestaurantTable, TableStatus } from '../types';

export interface TablePayload {
    tableNumber: string;
    capacity: number;
    area?: string;
    status?: TableStatus;
    positionX?: number;
    positionY?: number;
}

export async function getTables() {
    const response = await api.get<RestaurantTable[]>('/tables');
    return response.data;
}

export async function createTable(payload: TablePayload) {
    const response = await api.post<RestaurantTable>('/tables', payload);
    return response.data;
}

export async function updateTable(id: number, payload: Partial<TablePayload>) {
    const response = await api.patch<RestaurantTable>(`/tables/${id}`, payload);
    return response.data;
}

export async function deleteTable(id: number) {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
}

export async function updateTableStatus(id: number, status: TableStatus) {
    const response = await api.patch<RestaurantTable>(`/tables/${id}/status`, { status });
    return response.data;
}