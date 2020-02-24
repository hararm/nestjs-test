import {Controller, Delete, Get, Logger, NotFoundException, Param} from '@nestjs/common';
import {MessagesRepository} from '../repositories/messages.repository';

@Controller('messages')
export class MessagesController {
    private logger = new Logger('MessagesController');
    constructor(private groupsRepository: MessagesRepository) {
    }

    @Get(':id')
    async findMessagesByGroupId(@Param('id') id: string) {
        const messages = await this.groupsRepository.findMessagesByGroupId(id);
        if (!messages) {
            throw new NotFoundException('Could not find group for url ' + id);
        }
        this.logger.verbose(`Retrieving all Messages for the group ${id}`);
        return messages;
    }

    @Delete(':id')
    deleteGroup(@Param('id') id: string) {
        return this.groupsRepository.deleteMessage(id);
    }
}
