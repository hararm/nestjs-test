import {
    Body,
    Controller, Get,
    Logger,
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
    async createGroup(@UploadedFile() file: any, @Body('name') name): Promise<Group> {
        this.logger.debug(`Data ${JSON.stringify(file)}`);
        this.logger.debug(file.filename);
        this.logger.debug(name);
        return this.groupsRepository.addGroup(file.filename, name);
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './files' });
    }
}
