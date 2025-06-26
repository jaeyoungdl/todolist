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
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const users_service_1 = require("../users/users.service");
let TodosService = class TodosService {
    constructor(todoRepository, usersService) {
        this.todoRepository = todoRepository;
        this.usersService = usersService;
    }
    async create(createTodoDto, user) {
        const todo = this.todoRepository.create({
            ...createTodoDto,
            authorId: user.id,
            assignedToId: createTodoDto.assignedToId || user.id,
            startDate: createTodoDto.startDate ? new Date(createTodoDto.startDate) : undefined,
            endDate: createTodoDto.endDate ? new Date(createTodoDto.endDate) : undefined,
        });
        if (createTodoDto.assigneeIds && createTodoDto.assigneeIds.length > 0) {
            const assignees = await Promise.all(createTodoDto.assigneeIds.map(id => this.usersService.findOne(id)));
            todo.assignees = assignees;
        }
        else if (createTodoDto.assignedToId) {
            const assignee = await this.usersService.findOne(createTodoDto.assignedToId);
            todo.assignees = [assignee];
        }
        else {
            todo.assignees = [user];
        }
        return await this.todoRepository.save(todo);
    }
    async findAll(user) {
        const todos = await this.todoRepository
            .createQueryBuilder('todo')
            .leftJoinAndSelect('todo.author', 'author')
            .leftJoinAndSelect('todo.assignedTo', 'assignedTo')
            .leftJoinAndSelect('todo.assignees', 'assignees')
            .where('todo.authorId = :userId', { userId: user.id })
            .orWhere('todo.assignedToId = :userId', { userId: user.id })
            .orWhere('assignees.id = :userId', { userId: user.id })
            .orderBy('todo.createdAt', 'DESC')
            .getMany();
        console.log(`사용자 ${user.id}의 할 일 ${todos.length}개를 조회했습니다.`);
        return todos;
    }
    async findOne(id, user) {
        const todo = await this.todoRepository.findOne({
            where: { id },
            relations: ['author', 'assignedTo', 'assignees'],
        });
        if (!todo) {
            throw new common_1.NotFoundException('할 일을 찾을 수 없습니다.');
        }
        const hasAccess = todo.authorId === user.id ||
            todo.assignedToId === user.id ||
            todo.assignees?.some(assignee => assignee.id === user.id);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('접근 권한이 없습니다.');
        }
        return todo;
    }
    async update(id, updateTodoDto, user) {
        const todo = await this.findOne(id, user);
        if (todo.authorId !== user.id) {
            throw new common_1.ForbiddenException('수정 권한이 없습니다.');
        }
        if (updateTodoDto.startDate) {
            todo.startDate = new Date(updateTodoDto.startDate);
        }
        if (updateTodoDto.endDate) {
            todo.endDate = new Date(updateTodoDto.endDate);
        }
        if (updateTodoDto.assigneeIds && updateTodoDto.assigneeIds.length > 0) {
            const assignees = await Promise.all(updateTodoDto.assigneeIds.map(id => this.usersService.findOne(id)));
            todo.assignees = assignees;
        }
        Object.assign(todo, updateTodoDto);
        return await this.todoRepository.save(todo);
    }
    async remove(id, user) {
        const todo = await this.findOne(id, user);
        if (todo.authorId !== user.id) {
            throw new common_1.ForbiddenException('삭제 권한이 없습니다.');
        }
        await this.todoRepository.remove(todo);
    }
    async updateStatus(id, status, user) {
        const todo = await this.findOne(id, user);
        const canUpdate = todo.authorId === user.id ||
            todo.assignedToId === user.id ||
            todo.assignees?.some(assignee => assignee.id === user.id);
        if (!canUpdate) {
            throw new common_1.ForbiddenException('상태 변경 권한이 없습니다.');
        }
        todo.status = status;
        return await this.todoRepository.save(todo);
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], TodosService);
//# sourceMappingURL=todos.service.js.map