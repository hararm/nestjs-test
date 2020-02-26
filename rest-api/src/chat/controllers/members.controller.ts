import {Controller, Get, Logger, Param} from '@nestjs/common';
import {MemberRepository} from '../repositories/member.repository';
import {GroupMember} from '../models/member.model';
import {GroupRepository} from '../repositories/group.repository';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';

@Controller('members')
export class MembersController {
    private logger = new Logger('MembersController');

    constructor(private memberRepository: MemberRepository, private groupsRepository: GroupRepository) {
    }

    @Get()
    async findAllCourses(): Promise<User[]> {
        this.logger.verbose(`Retrieving all users`);
        return this.memberRepository.findAll();
    }

    @Get(':id')
    async findUsersByGroupId(@Param('id') id: string): Promise<GroupMember[]> {
        this.logger.verbose(`Retrieving all users for the group: ${id}`);
        const group: Group = await this.groupsRepository.findGroupById(id);
        if (group) {
            return group.members;
        }
        return null;
    }
}
