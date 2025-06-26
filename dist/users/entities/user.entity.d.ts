import { Todo } from '../../todos/entities/todo.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    todos: Todo[];
    assignedTodos: Todo[];
}
