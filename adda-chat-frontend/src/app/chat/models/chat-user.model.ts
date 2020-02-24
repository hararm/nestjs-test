import {IChatUser} from '../../../../../shared/chat-user';

export class ChatUser implements IChatUser {
  public _id: string;
  constructor(
    public userName: string,
    public email,
    public channelId: string,
    public isOnline: boolean) {
  }
}
