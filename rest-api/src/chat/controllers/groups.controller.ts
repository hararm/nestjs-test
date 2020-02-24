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
import {GroupRepository} from '../repositories/group.repository';
import {Group} from '../models/group.model';
import {FileInterceptor} from '@nestjs/platform-express';
import {ImageFileFilter} from '../filters/imageFileFilter';
import {ChatUser} from '../../../../shared/chat-user';

@Controller('groups')
export class GroupsController {
    private logger = new Logger('GroupsController');

    constructor(private groupsRepository: GroupRepository) {
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

    @Get()
    async findAllCourses(): Promise<Group[]> {
        this.logger.verbose(`Retrieving all courses`);
        return this.groupsRepository.findAll();
    }

    @Get(':groupName')
    async findGroupByUrl(@Param('groupName') groupName: string) {
        const course = await this.groupsRepository.findGroupByName(groupName);
        if (!course) {
            throw new NotFoundException('Could not find group for url ' + groupName);
        }
        this.logger.verbose(`Retrieving the course ${course.groupName}`);
        return course;
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
}
