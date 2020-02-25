import {IGroupMember} from '../../../../shared/member';
import {IsMongoId, IsString} from 'class-validator';

export class GroupMember implements IGroupMember {
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
