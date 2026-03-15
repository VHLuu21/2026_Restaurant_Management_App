import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async findAll(query: any) {
    const {
      search,
      position,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = query;

    const qb = this.employeeRepo.createQueryBuilder('employee');

    // Search theo tên
    if (search) {
      qb.andWhere('employee.fullName LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Filter theo position
    if (position) {
      qb.andWhere('employee.position = :position', { position });
    }

    // Sort
    qb.orderBy(`employee.${sort}`, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.employeeRepo.findOneBy({ id });
  }

  create(data: CreateEmployeeDto) {
    const employee = this.employeeRepo.create(data);
    return this.employeeRepo.save(employee);
  }

  async update(id: number, data: UpdateEmployeeDto) {
    await this.employeeRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.employeeRepo.delete(id);
  }
}