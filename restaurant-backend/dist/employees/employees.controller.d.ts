import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    getAll(query: any): Promise<{
        data: import("./employee.entity").Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOne(id: number): Promise<import("./employee.entity").Employee>;
    create(data: CreateEmployeeDto): Promise<import("./employee.entity").Employee>;
    update(id: number, data: UpdateEmployeeDto): Promise<import("./employee.entity").Employee>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
}
