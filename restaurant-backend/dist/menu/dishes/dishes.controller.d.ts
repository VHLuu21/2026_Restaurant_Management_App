import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishesService } from './dishes.service';
export declare class DishesController {
    private readonly dishesService;
    constructor(dishesService: DishesService);
    findPublicList(categoryId?: string): Promise<import("./dish.entity").Dish[]>;
    create(dto: CreateDishDto): Promise<import("./dish.entity").Dish>;
    findAll(categoryId?: string): Promise<import("./dish.entity").Dish[]>;
    findOne(id: number): Promise<import("./dish.entity").Dish>;
    update(id: number, dto: UpdateDishDto): Promise<import("./dish.entity").Dish>;
    toggleAvailability(id: number, isAvailable: boolean): Promise<import("./dish.entity").Dish>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
