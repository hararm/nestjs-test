import {Controller, Get, Logger, Param} from '@nestjs/common';
import {ChatUserRepository} from '../repositories/chat-user.repository';
import {ChatUser} from '../models/chat-user.model';

@Controller('users')
export class ChatUserController {
    private logger = new Logger('ChatUserController');

    constructor(private usersRepository: ChatUserRepository) {
    }

    @Get()
    async findAllCourses(): Promise<ChatUser[]> {
        this.logger.verbose(`Retrieving all users`);
        return this.usersRepository.findAll();
    }

    @Get(':id')
    async findUsersByGroupId(@Param('id') id: string): Promise<ChatUser[]> {
        this.logger.verbose(`Retrieving all users for the group: ${id}`);
        return this.usersRepository.findUsersByGroupId(id);
    }
}
