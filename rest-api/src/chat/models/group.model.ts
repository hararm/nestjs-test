import {IGroup} from '../../../../shared/iGroup';
import {IsMongoId, IsString} from 'class-validator';

export class  Group implements IGroup {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString() image: string;
    members: [];
    @IsString() groupName: string;
}
