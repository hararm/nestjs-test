import {Controller, Delete, Get, Logger, NotFoundException, Param} from '@nestjs/common';
import {MessagesRepository} from '../repositories/messages.repository';

@Controller('messages')
export class MessagesController {
    private logger = new Logger('MessagesController');
    constructor(private groupsRepository: MessagesRepository) {
    }

    @Get(':groupId')
    async findMessagesByGroupId(@Param('groupId') groupId: string) {
        this.logger.verbose(`Retrieving all Messages for the group ${groupId}`);
        return await this.groupsRepository.findMessagesByGroupId(groupId);
    }

    @Delete(':id')
    deleteGroup(@Param('id') id: string) {
        return this.groupsRepository.deleteMessage(id);
    }
}
