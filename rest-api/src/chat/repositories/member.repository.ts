import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {GroupMember} from '../models/member.model';
import {Group} from '../models/group.model';

@Injectable()
export class MemberRepository {
    private logger = new Logger('MemberRepository');
    constructor(@InjectModel('ChatUser') private membersModel: Model<GroupMember>,
                @InjectModel('Group') private groupModel: Model<Group>) {

    }

    async findAll(): Promise<GroupMember[]> {
        return this.membersModel.find();
    }
}
