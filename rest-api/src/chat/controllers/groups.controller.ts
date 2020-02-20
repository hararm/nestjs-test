import {
    Body,
    Controller, Get,
    Logger, NotFoundException,
    Param,
    Post, Res,
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

@Controller('groups')
export class GroupsController {
    private logger = new Logger('GroupsController');

    constructor(private groupsRepository: GroupRepository) {
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', { dest: './files', fileFilter: ImageFileFilter})
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
    async findCourseByUrl(@Param('groupName') groupName: string) {
        const course = await this.groupsRepository.findGroupByName(groupName);
        if (!course) {
            throw new NotFoundException('Could not find course for url ' + groupName);
        }
        this.logger.verbose(`Retrieving the course ${course.groupName}`);
        return course;
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './files' });
    }
}
