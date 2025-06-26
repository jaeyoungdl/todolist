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
exports.CreateTodoDto = void 0;
const class_validator_1 = require("class-validator");
const todo_entity_1 = require("../entities/todo.entity");
class CreateTodoDto {
}
exports.CreateTodoDto = CreateTodoDto;
__decorate([
    (0, class_validator_1.IsString)({ message: '제목은 문자열이어야 합니다.' }),
    (0, class_validator_1.IsNotEmpty)({ message: '제목을 입력해주세요.' }),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '설명은 문자열이어야 합니다.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(todo_entity_1.TodoStatus, { message: '올바른 상태값을 입력해주세요.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: '올바른 날짜 형식을 입력해주세요.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: '올바른 날짜 형식을 입력해주세요.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: '올바른 사용자 ID를 입력해주세요.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTodoDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: '담당자 목록은 배열이어야 합니다.' }),
    (0, class_validator_1.IsUUID)(4, { each: true, message: '올바른 사용자 ID를 입력해주세요.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTodoDto.prototype, "assigneeIds", void 0);
//# sourceMappingURL=create-todo.dto.js.map