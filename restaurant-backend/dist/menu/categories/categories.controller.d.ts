import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findPublicList(): Promise<import("./category.entity").MenuCategory[]>;
    create(dto: CreateCategoryDto): Promise<import("./category.entity").MenuCategory>;
    findAll(): Promise<import("./category.entity").MenuCategory[]>;
    findOne(id: number): Promise<import("./category.entity").MenuCategory>;
    update(id: number, dto: UpdateCategoryDto): Promise<import("./category.entity").MenuCategory>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
