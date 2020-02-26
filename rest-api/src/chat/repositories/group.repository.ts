import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Group} from '../models/group.model';
import {GroupMember} from '../models/member.model';

@Injectable()
export class GroupRepository {
    constructor(@InjectModel('Group') private groupModel: Model<Group>) {

    }

    async addGroup(data: any, name: string, clinicName: string): Promise<Group> {
        const group = new Group();
        group.image = data;
        group.groupName = name;
        group.clinicName = clinicName;
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

    async findGroupById(id: string): Promise<Group> {
        return this.groupModel.findOne({_id: id});
    }

    async findGroupByClinicName(clinicName: string) {
        return this.groupModel.find({clinicName});
    }

    async updateGroup(groupId: string, changes: Partial<Group>): Promise<Group> {
        return this.groupModel.findOneAndUpdate({_id: groupId}, changes, {new: true});
    }

    async addMembersToGroup(groupId: string, members: GroupMember[]): Promise<Group> {
        const group = await this.findGroupById(groupId);
        if (group) {
            group.members = members;
        }
        return await this.updateGroup(groupId, group);
    }

    async deleteGroup(groupId: string) {
        return await this.groupModel.deleteOne({_id: groupId});
    }

}
