import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../users/entities/user.entity';
export declare class TodosController {
    private readonly todosService;
    constructor(todosService: TodosService);
    create(createTodoDto: CreateTodoDto, user: User): Promise<import("./entities/todo.entity").Todo>;
    findAll(user: User): Promise<import("./entities/todo.entity").Todo[]>;
    findOne(id: string, user: User): Promise<import("./entities/todo.entity").Todo>;
    update(id: string, updateTodoDto: UpdateTodoDto, user: User): Promise<import("./entities/todo.entity").Todo>;
    updateStatus(id: string, status: string, user: User): Promise<import("./entities/todo.entity").Todo>;
    remove(id: string, user: User): Promise<void>;
}
