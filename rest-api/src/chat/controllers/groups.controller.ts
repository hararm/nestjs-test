import {Body, Controller, Logger, Post, UseGuards} from '@nestjs/common';
import {AdminGuard} from '../../guards/admin.guard';
import {GroupRepository} from '../repositories/group.repository';
import {Group} from '../models/group.model';

@Controller('groups')
export class GroupsController {
    private logger = new Logger('GroupsController');

    constructor(private groupsRepository: GroupRepository) {
    }

    @Post()
    @UseGuards(AdminGuard)
    async createGroup(@Body() group: Group): Promise<Group> {
        return this.groupsRepository.addGroup(group);
    }
}
