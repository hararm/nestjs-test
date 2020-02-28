import {Controller, Delete, Get, Logger, NotFoundException, Param} from '@nestjs/common';
import {MessagesRepositoryService} from '../repositories/messages.repository.service';

@Controller('messages')
export class MessagesController {
    private logger = new Logger('MessagesController');

    constructor(private groupsRepository: MessagesRepositoryService) {
    }

    @Get(':groupId')
    async findMessagesByGroupId(@Param('groupId') groupId: string) {
        this.logger.verbose(`Retrieving all Messages for the group ${groupId}`);
        return await this.groupsRepository.findMessagesByGroupId(groupId);
    }

    @Delete(':id')
    async deleteGroup(@Param('id') id: string) {
        return await this.groupsRepository.deleteMessage(id);
    }
}
