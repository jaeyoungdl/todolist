import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
export declare class TodosService {
    private todoRepository;
    private usersService;
    constructor(todoRepository: Repository<Todo>, usersService: UsersService);
    create(createTodoDto: CreateTodoDto, user: User): Promise<Todo>;
    findAll(user: User): Promise<Todo[]>;
    findOne(id: string, user: User): Promise<Todo>;
    update(id: string, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo>;
    remove(id: string, user: User): Promise<void>;
    updateStatus(id: string, status: string, user: User): Promise<Todo>;
}
