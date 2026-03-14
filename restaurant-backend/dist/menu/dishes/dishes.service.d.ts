import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './dish.entity';
export declare class DishesService {
    private readonly dishRepository;
    private readonly categoriesService;
    constructor(dishRepository: Repository<Dish>, categoriesService: CategoriesService);
    create(dto: CreateDishDto): Promise<Dish>;
    findAll(categoryId?: number): Promise<Dish[]>;
    findPublicList(categoryId?: number): Promise<Dish[]>;
    findOne(id: number): Promise<Dish>;
    update(id: number, dto: UpdateDishDto): Promise<Dish>;
    remove(id: number): Promise<{
        message: string;
    }>;
    toggleAvailability(id: number, isAvailable: boolean): Promise<Dish>;
}
