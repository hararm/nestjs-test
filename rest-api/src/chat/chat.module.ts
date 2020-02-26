import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupSchema} from './schemas/group.schema';
import {GroupsController} from './controllers/groups.controller';
import {GroupRepository} from './repositories/group.repository';
import {ClinicsController} from './controllers/clinics.controller';
import {MessagesController} from './controllers/messages.controller';
import {MessagesRepository} from './repositories/messages.repository';
import {ChatMessageSchema} from './schemas/chat.message.schema';
import {MemberSchema} from './schemas/member.schema';
import {MemberRepository} from './repositories/member.repository';
import {MembersController} from './controllers/members.controller';
import {UsersSchema} from '../auth/schemas/users.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Group', schema: GroupSchema},
            {name: 'ChatMessage', schema: ChatMessageSchema},
            {name: 'ChatMember', schema: MemberSchema},
            {name: 'User', schema: UsersSchema}
        ]),
    ],
    controllers: [
        MessagesController,
        GroupsController,
        ClinicsController,
        MembersController
    ],
    providers: [
        GroupRepository,
        MessagesRepository,
        MemberRepository
    ],
    exports: [
        GroupRepository,
        MessagesRepository,
        MemberRepository
    ]
})
export class ChatModule {
}
