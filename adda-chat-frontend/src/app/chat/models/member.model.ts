import {IUser} from '../../../../../shared/user';

export class GroupMember implements IUser {
    constructor(
    public nickName: string,
    public email,
    public channelId: string,
    public isOnline: boolean, public _id: string = null,) {
  }
}
