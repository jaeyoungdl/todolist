import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Sse, MessageEvent } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Observable, Subject } from 'rxjs';

@Controller('todos')
export class TodosController {
  private eventSubject = new Subject<MessageEvent>();

  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Body('userId') userId: string) {
    const todo = await this.todosService.create(createTodoDto, userId);
    
    // SSE 이벤트 전송
    this.emitEvent('todoCreated', todo);
    
    return todo;
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.todosService.findOne(id, userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Body('userId') userId: string) {
    const todo = await this.todosService.update(id, updateTodoDto, userId);
    
    // SSE 이벤트 전송
    this.emitEvent('todoUpdated', todo);
    
    return todo;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('userId') userId: string) {
    const todo = await this.todosService.updateStatus(id, status, userId);
    
    // SSE 이벤트 전송
    this.emitEvent('todoStatusChanged', todo);
    
    return todo;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    await this.todosService.remove(id, userId);
    
    // SSE 이벤트 전송
    this.emitEvent('todoDeleted', { id });
    
    return { message: '할 일이 삭제되었습니다.' };
  }

  @Sse('events')
  sendEvents(@Query('token') token?: string): Observable<MessageEvent> {
    // TODO: 토큰 검증 로직 추가 (필요시)
    console.log('SSE 연결 요청, 토큰:', token ? '있음' : '없음');
    return this.eventSubject.asObservable();
  }

  private emitEvent(type: string, data: any) {
    this.eventSubject.next({
      type,
      data: JSON.stringify(data),
    } as MessageEvent);
  }
} 