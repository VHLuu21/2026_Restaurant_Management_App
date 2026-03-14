import api from './axios';
import type { Reservation, ReservationStatus } from '../types';

export async function getReservations(status?: ReservationStatus) {
    const response = await api.get<Reservation[]>('/reservations', {
        params: status ? { status } : undefined,
    });
    return response.data;
}

export async function getReservationById(id: number) {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
}

export async function updateReservationStatus(
    id: number,
    payload: {
        status: ReservationStatus;
        tableId?: number;
        adminNote?: string;
    },
) {
    const response = await api.patch<Reservation>(`/reservations/${id}/status`, payload);
    return response.data;
}