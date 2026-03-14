import api from './axios';
import type { LoginResponse } from '../types';

export async function loginApi(email: string, password: string) {
    const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
    });

    return response.data;
}