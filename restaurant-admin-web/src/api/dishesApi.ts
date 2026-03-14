import api from './axios';
import type { Dish } from '../types';

export interface DishPayload {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId: number;
}

export async function getDishes(categoryId?: number) {
    const response = await api.get<Dish[]>('/menu/dishes', {
        params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
}

export async function createDish(payload: DishPayload) {
    const response = await api.post<Dish>('/menu/dishes', payload);
    return response.data;
}

export async function updateDish(id: number, payload: Partial<DishPayload>) {
    const response = await api.patch<Dish>(`/menu/dishes/${id}`, payload);
    return response.data;
}

export async function deleteDish(id: number) {
    const response = await api.delete(`/menu/dishes/${id}`);
    return response.data;
}

export async function toggleDishAvailability(id: number, isAvailable: boolean) {
    const response = await api.patch<Dish>(`/menu/dishes/${id}/availability`, {
        isAvailable,
    });
    return response.data;
}