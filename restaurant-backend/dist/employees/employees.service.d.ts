import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    private employeeRepo;
    constructor(employeeRepo: Repository<Employee>);
    findAll(query: any): Promise<{
        data: Employee[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<Employee>;
    create(data: CreateEmployeeDto): Promise<Employee>;
    update(id: number, data: UpdateEmployeeDto): Promise<Employee>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
