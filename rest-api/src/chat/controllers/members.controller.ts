import {Body, Controller, Get, Logger, Param, Post} from '@nestjs/common';
import {UserRepository} from '../repositories/user-repository.service';
import {GroupRepository} from '../repositories/group.repository';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';

@Controller('members')
export class MembersController {
    private logger = new Logger('MembersController');

    constructor(private memberRepository: UserRepository, private groupsRepository: GroupRepository) {
    }

    @Get()
    async findAllUsers(): Promise<User[]> {
        this.logger.verbose(`Retrieving all users`);
        return this.memberRepository.findAll();
    }

    @Get(':id')
    async findMembersByGroupId(@Param('id') id: string): Promise<User[]> {
        this.logger.verbose(`Retrieving all members for the group: ${id}`);
        const group: Group = await this.groupsRepository.findGroupWithMembers(id);
        if (group) {
            this.logger.verbose(`Retrieved all members ${group.members} for the group: ${id}`);
            return group.members;
        }
        return null;
    }
}
