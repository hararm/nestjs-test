import {
    BadRequestException,
    Body,
    Controller, Delete, Get,
    Logger, NotFoundException,
    Param,
    Post, Put, Res,
    UploadedFile,
    UseFilters,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AdminGuard} from '../../guards/admin.guard';
import {GroupRepositoryService} from '../repositories/group.repository.service';
import {Group} from '../models/group.model';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageFileFilter} from '../filters/imageFileFilter';
import {User} from '../models/user.model';

@Controller('groups')
export class GroupsController {
    private logger = new Logger('GroupsController');

    constructor(private groupsRepository: GroupRepositoryService) {
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {dest: './files', fileFilter: ImageFileFilter})
    )
    // @UseGuards(AdminGuard)
    async createGroup(@UploadedFile() file: any, @Body('name') name, @Body('clinicName') clinicName): Promise<Group> {
        this.logger.debug(`Data ${JSON.stringify(file)}`);
        this.logger.debug('File Name', file.filename);
        this.logger.debug('Group Name', name);
        this.logger.debug('Clinic Name', clinicName);
        return this.groupsRepository.addGroup(file.filename, name, clinicName);
    }

    @Put(':id')
    async updateGroup(@Param('id') id: string, @Body() group: Group) {
        this.logger.verbose(`Update group ${id}`);
        return this.groupsRepository.updateGroup(id, group);
    }

    @Get()
    async findAllGroups(): Promise<Group[]> {
        this.logger.verbose(`Retrieving all groups`);
        return this.groupsRepository.findAll();
    }

    @Get(':groupName')
    async findGroupByUrl(@Param('groupName') groupName: string) {
        const group = await this.groupsRepository.findGroupByName(groupName);
        if (!group) {
            throw new NotFoundException('Could not find group for url ' + groupName);
        }
        this.logger.verbose(`Retrieving the course ${group.groupName}`);
        return group;
    }

    @Get('findGroupById/:id')
    async findGroupById(@Param('id') id: string) {
        const group = await this.groupsRepository.findGroupById(id);
        if (!group) {
            throw new NotFoundException('Could not find group for url ' + id);
        }
        this.logger.verbose(`Retrieving the group ${group.groupName}`);
        return group;
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, {root: './files'});
    }

    @Delete(':groupId')
    deleteGroup(@Param('groupId') groupId: string) {
        return this.groupsRepository.deleteGroup(groupId);
    }

    @Get('findMembers/:groupId')
    async findGroupWithMembers(@Param('groupId') groupId: string) {
        return await this.groupsRepository.findGroupWithMembers(groupId);
    }
}
