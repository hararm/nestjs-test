import {IGroupMember} from '../../../../../shared/member';


export class GroupMember implements IGroupMember {
  public _id: string;
    constructor(
    public userName: string,
    public email,
    public channelId: string,
    public isOnline: boolean) {
  }
}
