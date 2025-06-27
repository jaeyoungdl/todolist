import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Body('userId') userId: string) {
    return this.todosService.create(createTodoDto, userId);
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
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Body('userId') userId: string) {
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('userId') userId: string) {
    return this.todosService.updateStatus(id, status, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.todosService.remove(id, userId);
  }
} 