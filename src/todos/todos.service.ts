import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private usersService: UsersService,
  ) {}

  async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
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

    return await this.todoRepository.save(todo);
  }

  async findAll(user: User): Promise<Todo[]> {
    const todos = await this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.author', 'author')
      .leftJoinAndSelect('todo.assignedTo', 'assignedTo')
      .leftJoinAndSelect('todo.assignees', 'assignees')
      .orderBy('todo.createdAt', 'DESC')
      .getMany();

    console.log(`모든 할 일 ${todos.length}개를 조회했습니다.`);
    return todos;
  }

  async findOne(id: string, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['author', 'assignedTo', 'assignees'],
    });

    if (!todo) {
      throw new NotFoundException('할 일을 찾을 수 없습니다.');
    }

    // 작성자이거나 할당된 사용자이거나 담당자 중 하나인지 확인
    const hasAccess = todo.authorId === user.id || 
                     todo.assignedToId === user.id || 
                     todo.assignees?.some(assignee => assignee.id === user.id);

    if (!hasAccess) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);

    // 작성자만 수정 가능
    if (todo.authorId !== user.id) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

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
    return await this.todoRepository.save(todo);
  }

  async remove(id: string, user: User): Promise<void> {
    const todo = await this.findOne(id, user);

    // 작성자만 삭제 가능
    if (todo.authorId !== user.id) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.todoRepository.remove(todo);
  }

  async updateStatus(id: string, status: string, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);

    // 작성자이거나 담당자만 상태 변경 가능
    const canUpdate = todo.authorId === user.id || 
                     todo.assignedToId === user.id || 
                     todo.assignees?.some(assignee => assignee.id === user.id);

    if (!canUpdate) {
      throw new ForbiddenException('상태 변경 권한이 없습니다.');
    }

    todo.status = status as any;
    return await this.todoRepository.save(todo);
  }
} 