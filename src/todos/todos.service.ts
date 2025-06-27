import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TodosGateway } from './todos.gateway';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private usersService: UsersService,
    private todosGateway: TodosGateway,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    // 전달받은 사용자 ID 사용
    const user = await this.usersService.findOne(userId);
    
    const todo = this.todoRepository.create({
      ...createTodoDto,
      authorId: user.id,
      assignedToId: createTodoDto.assignedToId || user.id,
      startDate: createTodoDto.startDate ? new Date(createTodoDto.startDate) : undefined,
      endDate: createTodoDto.endDate ? new Date(createTodoDto.endDate) : undefined,
    });

    // 다중 담당자 설정
    if (createTodoDto.assigneeIds && createTodoDto.assigneeIds.length > 0) {
      const assignees = await Promise.all(
        createTodoDto.assigneeIds.map(id => this.usersService.findOne(id))
      );
      todo.assignees = assignees;
    } else if (createTodoDto.assignedToId) {
      const assignee = await this.usersService.findOne(createTodoDto.assignedToId);
      todo.assignees = [assignee];
    } else {
      todo.assignees = [user];
    }

    const savedTodo = await this.todoRepository.save(todo);
    
    // 관계 데이터 포함해서 다시 조회
    const todoWithRelations = await this.todoRepository.findOne({
      where: { id: savedTodo.id },
      relations: ['author', 'assignedTo', 'assignees'],
    });

    // WebSocket으로 실시간 알림
    this.todosGateway.notifyTodoCreated(todoWithRelations);

    return todoWithRelations;
  }

  async findAll(userId?: string): Promise<Todo[]> {
    // userId가 있으면 해당 사용자 관련 할 일만, 없으면 모든 할 일
    if (userId) {
      return this.todoRepository
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.author', 'author')
        .leftJoinAndSelect('todo.assignedTo', 'assignedTo')
        .leftJoinAndSelect('todo.assignees', 'assignees')
        .where('todo.authorId = :userId OR todo.assignedToId = :userId OR assignees.id = :userId', { userId })
        .orderBy('todo.createdAt', 'DESC')
        .getMany();
    } else {
      return this.todoRepository
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.author', 'author')
        .leftJoinAndSelect('todo.assignedTo', 'assignedTo')
        .leftJoinAndSelect('todo.assignees', 'assignees')
        .orderBy('todo.createdAt', 'DESC')
        .getMany();
    }
  }

  async findOne(id: string, userId?: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['author', 'assignedTo', 'assignees'],
    });

    if (!todo) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId?: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    // 날짜 변환
    if (updateTodoDto.startDate) {
      todo.startDate = new Date(updateTodoDto.startDate);
    }
    if (updateTodoDto.endDate) {
      todo.endDate = new Date(updateTodoDto.endDate);
    }

    // 다중 담당자 업데이트
    if (updateTodoDto.assigneeIds && updateTodoDto.assigneeIds.length > 0) {
      const assignees = await Promise.all(
        updateTodoDto.assigneeIds.map(id => this.usersService.findOne(id))
      );
      todo.assignees = assignees;
    }

    Object.assign(todo, updateTodoDto);
    const updatedTodo = await this.todoRepository.save(todo);

    // 관계 데이터 포함해서 다시 조회
    const todoWithRelations = await this.todoRepository.findOne({
      where: { id: updatedTodo.id },
      relations: ['author', 'assignedTo', 'assignees'],
    });

    // WebSocket으로 실시간 알림
    this.todosGateway.notifyTodoUpdated(todoWithRelations);

    return todoWithRelations;
  }

  async remove(id: string, userId?: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);

    // WebSocket으로 실시간 알림
    this.todosGateway.notifyTodoDeleted(id);
  }

  async updateStatus(id: string, status: string, userId?: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.status = status as any;
    const updatedTodo = await this.todoRepository.save(todo);

    // 관계 데이터 포함해서 다시 조회
    const todoWithRelations = await this.todoRepository.findOne({
      where: { id: updatedTodo.id },
      relations: ['author', 'assignedTo', 'assignees'],
    });

    // WebSocket으로 실시간 알림
    this.todosGateway.notifyTodoStatusChanged(todoWithRelations);

    return todoWithRelations;
  }
} 