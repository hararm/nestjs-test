import {IChatMessage} from '../../../../shared/chat-message';
import {IsMongoId, IsString} from 'class-validator';

export class ChatMessage implements IChatMessage {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString()
    channelId: string;
    @IsString()
    message: string;
    @IsString()
    recipientId: string;
    @IsString()
    senderId: string;
    @IsString()
    senderNicName: string;
    @IsString()
    timeStamp: string;
}
