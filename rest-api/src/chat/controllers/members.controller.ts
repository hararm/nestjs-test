import {Body, Controller, Get, Logger, Param, Post, UseInterceptors} from '@nestjs/common';
import {UserRepository} from '../repositories/user-repository.service';
import {GroupRepositoryService} from '../repositories/group.repository.service';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';
import {PasswordInterceptor} from '../../interceptors/password-interceptor';

@Controller('members')
export class MembersController {
    private logger = new Logger('MembersController');

    constructor(private memberRepository: UserRepository, private groupsRepository: GroupRepositoryService) {
    }

    @UseInterceptors(PasswordInterceptor)
    @Get()
    async findAllUsers(): Promise<User[]> {
        this.logger.verbose(`Retrieving all users`);
        return this.memberRepository.findAll();
    }

    @UseInterceptors(PasswordInterceptor)
    @Get(':id')
    async findMembersByGroupId(@Param('id') id: string): Promise<User[]> {
        this.logger.verbose(`Retrieving all members for the group: ${id}`);
        const group: Group = await this.groupsRepository.findGroupWithMembers(id);
        if (group) {
            return group.members;
        }
        return null;
    }
}
