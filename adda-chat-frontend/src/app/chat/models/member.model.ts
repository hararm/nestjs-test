import {IGroupMember} from '../../../../../shared/member';


export class GroupMember implements IGroupMember {
    constructor(
    public userName: string,
    public email,
    public channelId: string,
    public isOnline: boolean, public _id: string = null,) {
  }
}
