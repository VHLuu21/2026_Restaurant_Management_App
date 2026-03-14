import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishesService } from './dishes.service';

@Controller('menu/dishes')
export class DishesController {
    constructor(private readonly dishesService: DishesService) { }

    @Get('public/list')
    findPublicList(@Query('categoryId') categoryId?: string) {
        return this.dishesService.findPublicList(
            categoryId ? Number(categoryId) : undefined,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateDishDto) {
        return this.dishesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('categoryId') categoryId?: string) {
        return this.dishesService.findAll(
            categoryId ? Number(categoryId) : undefined,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.dishesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateDishDto,
    ) {
        return this.dishesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/availability')
    toggleAvailability(
        @Param('id', ParseIntPipe) id: number,
        @Body('isAvailable') isAvailable: boolean,
    ) {
        return this.dishesService.toggleAvailability(id, isAvailable);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.dishesService.remove(id);
    }
}