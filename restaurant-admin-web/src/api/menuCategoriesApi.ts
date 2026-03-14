import api from './axios';
import type { MenuCategory } from '../types';

export interface CategoryPayload {
    name: string;
    description?: string;
    isActive?: boolean;
}

export async function getMenuCategories() {
    const response = await api.get<MenuCategory[]>('/menu/categories');
    return response.data;
}

export async function createMenuCategory(payload: CategoryPayload) {
    const response = await api.post<MenuCategory>('/menu/categories', payload);
    return response.data;
}

export async function updateMenuCategory(
    id: number,
    payload: Partial<CategoryPayload>,
) {
    const response = await api.patch<MenuCategory>(`/menu/categories/${id}`, payload);
    return response.data;
}

export async function deleteMenuCategory(id: number) {
    const response = await api.delete(`/menu/categories/${id}`);
    return response.data;
}