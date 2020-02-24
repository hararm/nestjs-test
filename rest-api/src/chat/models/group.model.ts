import {IGroup} from '../../../../shared/chat-group';
import {IsMongoId, IsString} from 'class-validator';
import {ChatUser} from '../../../../shared/chat-user';

export class  Group implements IGroup {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString() image: string;
    members: ChatUser[];
    @IsString() groupName: string;
    @IsString() clinicName: string;
}
