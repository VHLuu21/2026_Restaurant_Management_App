export declare enum EmployeePosition {
    MANAGER = "MANAGER",
    WAITER = "WAITER",
    CHEF = "CHEF",
    CASHIER = "CASHIER",
    RECEPTIONIST = "RECEPTIONIST"
}
export declare class CreateEmployeeDto {
    fullName: string;
    phone: string;
    email?: string;
    avatar?: string;
    position: EmployeePosition;
    salary?: number;
    hireDate?: Date;
    note?: string;
}
