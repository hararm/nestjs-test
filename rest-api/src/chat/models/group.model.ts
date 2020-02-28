import {IGroup} from '../../../../shared/chat-group';
import {IsMongoId, IsString} from 'class-validator';

export class  Group implements IGroup {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString() image: string;
    members: any[];
    @IsString() groupName: string;
    @IsString() clinicName: string;
}
