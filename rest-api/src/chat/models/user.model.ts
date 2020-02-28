import {IUser} from '../../../../shared/user';
import {IsMongoId, IsString} from 'class-validator';
import {Exclude} from 'class-transformer';

export class User implements IUser {
    @IsString()
    @IsMongoId()
    _id: string;
    @IsString()
    email: string;
    @Exclude()
    passwordHash: string;
}
