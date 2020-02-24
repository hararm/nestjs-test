import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupSchema} from './schemas/group.schema';
import {GroupsController} from './controllers/groups.controller';
import {GroupRepository} from './repositories/group.repository';
import {ClinicsController} from './controllers/clinics.controller';
import {MessagesController} from './controllers/messages.controller';
import {MessagesRepository} from './repositories/messages.repository';
import {ChatMessageSchema} from './schemas/chat.message.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Group', schema: GroupSchema},
            {name: 'ChatMessage', schema: ChatMessageSchema}
        ]),
    ],
    controllers: [
        MessagesController,
        GroupsController,
        ClinicsController
    ],
    providers: [
        GroupRepository,
        MessagesRepository,
    ],
    exports: [
        GroupRepository,
        MessagesRepository
    ]
})
export class ChatModule {
}
