import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findByEmail(email: string) {
        const cleanEmail = email.trim().toLowerCase();

        return this.userRepository.findOne({
            where: { email: cleanEmail }
        });
    }

    findAll() {
        return this.userRepository.find();
    }

    async create(data: Partial<User>) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async updatePassword(email: string, password: string) {
        await this.userRepository.update({ email }, { password });
    }
}