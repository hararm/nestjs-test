import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupSchema} from './schemas/group.schema';
import {GroupsController} from './controllers/groups.controller';
import {GroupRepositoryService} from './repositories/group.repository.service';
import {ClinicsController} from './controllers/clinics.controller';
import {MessagesController} from './controllers/messages.controller';
import {MessagesRepositoryService} from './repositories/messages.repository.service';
import {ChatMessageSchema} from './schemas/chat.message.schema';
import {UserRepository} from './repositories/user-repository.service';
import {UsersController} from './controllers/users.controller';
import {UsersSchema} from '../auth/schemas/users.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Group', schema: GroupSchema},
            {name: 'ChatMessage', schema: ChatMessageSchema},
            {name: 'User', schema: UsersSchema}
        ]),
    ],
    controllers: [
        MessagesController,
        GroupsController,
        ClinicsController,
        UsersController
    ],
    providers: [
        GroupRepositoryService,
        MessagesRepositoryService,
        UserRepository
    ],
    exports: [
        GroupRepositoryService,
        MessagesRepositoryService,
        UserRepository
    ]
})
export class ChatModule {
}
