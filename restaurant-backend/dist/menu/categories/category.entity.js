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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCategory = void 0;
const typeorm_1 = require("typeorm");
const dish_entity_1 = require("../dishes/dish.entity");
let MenuCategory = class MenuCategory {
};
exports.MenuCategory = MenuCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 150,
        unique: true,
    }),
    __metadata("design:type", String)
], MenuCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], MenuCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], MenuCategory.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dish_entity_1.Dish, (dish) => dish.category),
    __metadata("design:type", Array)
], MenuCategory.prototype, "dishes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], MenuCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'datetime',
    }),
    __metadata("design:type", Date)
], MenuCategory.prototype, "updatedAt", void 0);
exports.MenuCategory = MenuCategory = __decorate([
    (0, typeorm_1.Entity)('menu_categories')
], MenuCategory);
//# sourceMappingURL=category.entity.js.map