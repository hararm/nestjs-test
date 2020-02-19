import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Group} from '../models/group.model';

@Injectable()
export class GroupRepository {
    constructor(@InjectModel('Group') private groupModel: Model<Group>) {

    }

    async addGroup(data: any, name: string): Promise<Group> {
        const group = new Group();
        group.image = data;
        group.groupName = name;
        const newGroup = this.groupModel(group);
        await newGroup.save();
        return newGroup.toObject({versionKey: false});
    }

    async findAll(): Promise<Group[]> {
        return this.groupModel.find();
    }

    async findGroupByName(groupName: string): Promise<Group> {
        return this.groupModel.findOne({name: groupName});
    }

    async updateGroup(groupId: string, changes: Partial<Group>): Promise<Group> {
        return this.groupModel.findOneAndUpdate({_id: groupId}, changes, {new: true});
    }

    deleteGroup(groupId: string) {
        return this.groupModel.deleteOne({_id: groupId});
    }

}
