import { TodoStatus } from '../entities/todo.entity';
export declare class CreateTodoDto {
    title: string;
    description?: string;
    status?: TodoStatus;
    startDate?: string;
    endDate?: string;
    assignedToId?: string;
    assigneeIds?: string[];
}
