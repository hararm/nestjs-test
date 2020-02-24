import {IChatMessage} from '../../../../../shared/chat-message';
export class  ChatMessage implements IChatMessage {
  constructor(
    public channelId: string,
    public senderId: string,
    public message: string,
    public recipientId: string,
    public senderNicName: string,
    public timeStamp: string
  ) {  }
}
