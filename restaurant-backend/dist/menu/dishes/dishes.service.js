"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categories_service_1 = require("../categories/categories.service");
const dish_entity_1 = require("./dish.entity");
let DishesService = class DishesService {
    constructor(dishRepository, categoriesService) {
        this.dishRepository = dishRepository;
        this.categoriesService = categoriesService;
    }
    async create(dto) {
        await this.categoriesService.findOne(dto.categoryId);
        const existing = await this.dishRepository.findOne({
            where: {
                name: dto.name,
                categoryId: dto.categoryId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Món ăn đã tồn tại trong danh mục này');
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
    async findAll(categoryId) {
        const qb = this.dishRepository
            .createQueryBuilder('dish')
            .leftJoinAndSelect('dish.category', 'category')
            .orderBy('dish.id', 'DESC');
        if (categoryId) {
            qb.where('dish.categoryId = :categoryId', { categoryId });
        }
        return qb.getMany();
    }
    async findPublicList(categoryId) {
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
    async findOne(id) {
        const dish = await this.dishRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!dish) {
            throw new common_1.NotFoundException('Không tìm thấy món ăn');
        }
        return dish;
    }
    async update(id, dto) {
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
            throw new common_1.BadRequestException('Tên món đã tồn tại trong danh mục này');
        }
        Object.assign(dish, dto);
        return this.dishRepository.save(dish);
    }
    async remove(id) {
        const dish = await this.findOne(id);
        await this.dishRepository.remove(dish);
        return { message: 'Xóa món ăn thành công' };
    }
    async toggleAvailability(id, isAvailable) {
        const dish = await this.findOne(id);
        dish.isAvailable = isAvailable;
        return this.dishRepository.save(dish);
    }
};
exports.DishesService = DishesService;
exports.DishesService = DishesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService])
], DishesService);
//# sourceMappingURL=dishes.service.js.map