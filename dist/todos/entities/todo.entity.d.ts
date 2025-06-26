import { User } from '../../users/entities/user.entity';
export declare enum TodoStatus {
    TODO = "todo",
    IN_PROGRESS = "inProgress",
    COMPLETED = "completed"
}
export declare class Todo {
    id: string;
    title: string;
    description: string;
    status: TodoStatus;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    authorId: string;
    assignedTo: User;
    assignedToId: string;
    assignees: User[];
}
