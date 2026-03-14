import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './dish.entity';

@Injectable()
export class DishesService {
    constructor(
        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>,
        private readonly categoriesService: CategoriesService,
    ) { }

    async create(dto: CreateDishDto) {
        await this.categoriesService.findOne(dto.categoryId);

        const existing = await this.dishRepository.findOne({
            where: {
                name: dto.name,
                categoryId: dto.categoryId,
            },
        });

        if (existing) {
            throw new BadRequestException('Món ăn đã tồn tại trong danh mục này');
        }

        const dish = this.dishRepository.create({
            name: dto.name,
            description: dto.description,
            price: dto.price,
            imageUrl: dto.imageUrl,
            isAvailable: dto.isAvailable ?? true,
            categoryId: dto.categoryId,
        });

        return this.dishRepository.save(dish);
    }

    async findAll(categoryId?: number) {
        const qb = this.dishRepository
            .createQueryBuilder('dish')
            .leftJoinAndSelect('dish.category', 'category')
            .orderBy('dish.id', 'DESC');

        if (categoryId) {
            qb.where('dish.categoryId = :categoryId', { categoryId });
        }

        return qb.getMany();
    }

    async findPublicList(categoryId?: number) {
        const qb = this.dishRepository
            .createQueryBuilder('dish')
            .leftJoinAndSelect('dish.category', 'category')
            .where('dish.isAvailable = :isAvailable', { isAvailable: true })
            .andWhere('category.isActive = :isActive', { isActive: true })
            .orderBy('dish.id', 'DESC');

        if (categoryId) {
            qb.andWhere('dish.categoryId = :categoryId', { categoryId });
        }

        return qb.getMany();
    }

    async findOne(id: number) {
        const dish = await this.dishRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!dish) {
            throw new NotFoundException('Không tìm thấy món ăn');
        }

        return dish;
    }

    async update(id: number, dto: UpdateDishDto) {
        const dish = await this.findOne(id);

        if (dto.categoryId) {
            await this.categoriesService.findOne(dto.categoryId);
        }

        const nextName = dto.name ?? dish.name;
        const nextCategoryId = dto.categoryId ?? dish.categoryId;

        const duplicated = await this.dishRepository.findOne({
            where: {
                name: nextName,
                categoryId: nextCategoryId,
            },
        });

        if (duplicated && duplicated.id !== id) {
            throw new BadRequestException('Tên món đã tồn tại trong danh mục này');
        }

        Object.assign(dish, dto);
        return this.dishRepository.save(dish);
    }

    async remove(id: number) {
        const dish = await this.findOne(id);
        await this.dishRepository.remove(dish);
        return { message: 'Xóa món ăn thành công' };
    }

    async toggleAvailability(id: number, isAvailable: boolean) {
        const dish = await this.findOne(id);
        dish.isAvailable = isAvailable;
        return this.dishRepository.save(dish);
    }
}