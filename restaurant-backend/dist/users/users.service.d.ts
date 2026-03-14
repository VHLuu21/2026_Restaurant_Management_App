import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail(email: string): Promise<User>;
    findAll(): Promise<User[]>;
    create(data: Partial<User>): Promise<User>;
    updatePassword(email: string, password: string): Promise<void>;
}
