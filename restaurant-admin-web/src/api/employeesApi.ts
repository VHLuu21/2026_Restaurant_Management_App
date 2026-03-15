import api from './axios';
import type { Employee } from '../types';

export async function getEmployees(): Promise<Employee[]> {
    const res = await api.get('/employees');
    return res.data.data || res.data;
}

export async function createEmployee(payload: Partial<Employee>) {
    const res = await api.post('/employees', payload);
    return res.data;
}

export async function updateEmployee(id: number, payload: Partial<Employee>) {
    const res = await api.patch(`/employees/${id}`, payload);
    return res.data;
}

export async function deleteEmployee(id: number) {
    const res = await api.delete(`/employees/${id}`);
    return res.data;
}