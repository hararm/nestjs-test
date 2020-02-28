import {Body, Controller, Get, Logger, Param, Post, UseInterceptors} from '@nestjs/common';
import {UserRepository} from '../repositories/user-repository.service';
import {GroupRepositoryService} from '../repositories/group.repository.service';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';
import {PasswordInterceptor} from '../../interceptors/password-interceptor';

@Controller('users')
export class UsersController {
    private logger = new Logger('UsersController');

    constructor(private memberRepository: UserRepository, private groupsRepository: GroupRepositoryService) {
    }

    @UseInterceptors(PasswordInterceptor)
    @Get()
    async findAllUsers(): Promise<User[]> {
        this.logger.verbose(`Retrieving all users`);
        return this.memberRepository.findAll();
    }

    @UseInterceptors(PasswordInterceptor)
    @Get('findById/:id')
    async findById(@Param('id') id: string): Promise<User> {
        return this.memberRepository.findById(id);
    }

    @UseInterceptors(PasswordInterceptor)
    @Get(':groupId')
    async findMembersByGroupId(@Param('groupId') groupId: string): Promise<User[]> {
        this.logger.verbose(`Retrieving all members for the group: ${groupId}`);
        const group: Group = await this.groupsRepository.findGroupWithMembers(groupId);
        if (group) {
            return group.members;
        }
        return null;
    }
}
