import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MenuCategory } from './category.entity';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<MenuCategory>);
    create(dto: CreateCategoryDto): Promise<MenuCategory>;
    findAll(): Promise<MenuCategory[]>;
    findPublicList(): Promise<MenuCategory[]>;
    findOne(id: number): Promise<MenuCategory>;
    update(id: number, dto: UpdateCategoryDto): Promise<MenuCategory>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
