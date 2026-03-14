import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { Dish } from './dish.entity';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Dish]), CategoriesModule],
    controllers: [DishesController],
    providers: [DishesService],
})
export class DishesModule { }