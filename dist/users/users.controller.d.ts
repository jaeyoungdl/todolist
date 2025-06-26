import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    getProfile(user: User): {
        id: string;
        email: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
    };
    findOne(id: string): Promise<User>;
}
