import {IGroup} from '../../../../shared/chat-group';
import {IsMongoId, IsString} from 'class-validator';
import {GroupMember} from './member.model';

export class  Group implements IGroup {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString() image: string;
    members: GroupMember[];
    @IsString() groupName: string;
    @IsString() clinicName: string;
}
