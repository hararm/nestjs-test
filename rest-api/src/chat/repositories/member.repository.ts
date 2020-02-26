import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {GroupMember} from '../models/member.model';
import {Group} from '../models/group.model';
import {User} from '../models/user.model';

@Injectable()
export class MemberRepository {
    private logger = new Logger('MemberRepository');
    constructor(@InjectModel('ChatMember') private membersModel: Model<GroupMember>,
                @InjectModel('Group') private groupModel: Model<Group>,
                @InjectModel('User') private userModel: Model<User>) {

    }

    async findAll(): Promise<User[]> {
        this.logger.debug('Find All Users');
        return this.userModel.find();
    }
}
