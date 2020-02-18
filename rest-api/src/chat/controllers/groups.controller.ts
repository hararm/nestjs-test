import {Body, Controller, Logger, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {AdminGuard} from '../../guards/admin.guard';
import {GroupRepository} from '../repositories/group.repository';
import {Group} from '../models/group.model';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('groups')
export class GroupsController {
    private logger = new Logger('GroupsController');

    constructor(private groupsRepository: GroupRepository) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(AdminGuard)
    async createGroup(@UploadedFile() file: any): Promise<Group> {
        this.logger.debug(`Data ${JSON.stringify(file)}`);
        return this.groupsRepository.addGroup(file);
    }
}
