import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MenuCategory } from './category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(MenuCategory)
        private readonly categoryRepository: Repository<MenuCategory>,
    ) { }

    async create(dto: CreateCategoryDto) {
        const existing = await this.categoryRepository.findOne({
            where: { name: dto.name },
        });

        if (existing) {
            throw new BadRequestException('Danh mục đã tồn tại');
        }

        const category = this.categoryRepository.create({
            name: dto.name,
            description: dto.description,
            isActive: dto.isActive ?? true,
        });

        return this.categoryRepository.save(category);
    }

    findAll() {
        return this.categoryRepository.find({
            order: { id: 'ASC' },
        });
    }

    findPublicList() {
        return this.categoryRepository.find({
            where: { isActive: true },
            order: { id: 'ASC' },
        });
    }

    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException('Không tìm thấy danh mục');
        }

        return category;
    }

    async update(id: number, dto: UpdateCategoryDto) {
        const category = await this.findOne(id);

        if (dto.name && dto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({
                where: { name: dto.name },
            });

            if (existing) {
                throw new BadRequestException('Tên danh mục đã tồn tại');
            }
        }

        Object.assign(category, dto);
        return this.categoryRepository.save(category);
    }

    async remove(id: number) {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        return { message: 'Xóa danh mục thành công' };
    }
}