export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'UNAVAILABLE';

export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'COMPLETED'
    | 'CANCELLED';

export interface UserInfo {
    id: number;
    email: string;
    fullName: string;
    role: UserRole;
}

export interface LoginResponse {
    accessToken: string;
    user: UserInfo;
}

export interface RestaurantTable {
    id: number;
    tableNumber: string;
    capacity: number;
    status: TableStatus;
    area?: string;
    positionX: number;
    positionY: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Reservation {
    id: number;
    customerName: string;
    phone: string;
    email?: string;
    reservationTime: string;
    guestCount: number;
    note?: string;
    status: ReservationStatus;
    adminNote?: string;
    tableId?: number;
    table?: RestaurantTable;
    createdAt?: string;
    updatedAt?: string;
}

export interface DashboardSummary {
    totalTables: number;
    availableTables: number;
    reservedTables: number;
    pendingReservations: number;
    confirmedReservations: number;
}
export interface MenuCategory {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Dish {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    categoryId: number;
    category: MenuCategory;
    createdAt?: string;
    updatedAt?: string;
}
export type OrderStatus = 'PENDING' | 'PREPARING' | 'SERVED' | 'CANCELLED';

export interface OrderItem {
    id: number;
    dishId: number;
    dishName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface Order {
    id: number;
    reservationId: number;
    reservation: Reservation;
    status: OrderStatus;
    totalAmount: number;
    note?: string;
    items: OrderItem[];
    createdAt?: string;
    updatedAt?: string;
}