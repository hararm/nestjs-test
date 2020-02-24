import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupSchema} from './schemas/group.schema';
import {GroupsController} from './controllers/groups.controller';
import {GroupRepository} from './repositories/group.repository';
import {ClinicsController} from './controllers/clinics.controller';
import {MessagesController} from './controllers/messages.controller';
import {MessagesRepository} from './repositories/messages.repository';
import {ChatMessageSchema} from './schemas/chat.message.schema';
import {ChatUserSchema} from './schemas/chat-user.schema';
import {ChatUserRepository} from "./repositories/chat-user.repository";
import {ChatUserController} from "./controllers/chat-user.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Group', schema: GroupSchema},
            {name: 'ChatMessage', schema: ChatMessageSchema},
            {name: 'ChatUser', schema: ChatUserSchema}
        ]),
    ],
    controllers: [
        MessagesController,
        GroupsController,
        ClinicsController,
        ChatUserController
    ],
    providers: [
        GroupRepository,
        MessagesRepository,
        ChatUserRepository
    ],
    exports: [
        GroupRepository,
        MessagesRepository,
        ChatUserRepository
    ]
})
export class ChatModule {
}
