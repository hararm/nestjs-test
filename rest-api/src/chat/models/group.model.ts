import {IGroup} from '../../../../shared/iGroup';
import {IsMongoId, IsString} from 'class-validator';

export class  Group implements IGroup {
    @IsString()
    @IsMongoId()
    _id: string;
    image: any;
    members: [];
    @IsString() name: string;
}
