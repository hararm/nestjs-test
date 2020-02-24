import {IChatUser} from '../../../../shared/chat-user';
import {IsMongoId, IsString} from 'class-validator';

export class ChatUser implements IChatUser {
        @IsString()
        @IsMongoId()
            _id: string;
        @IsString()
        public userName: string;
        @IsString()
        public email;
        @IsString()
        public channelId: string;
}
