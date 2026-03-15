import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getAll(@Query() query: any) {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.employeesService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateEmployeeDto) {
    return this.employeesService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: UpdateEmployeeDto) {
    return this.employeesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.employeesService.remove(id);
  }
}