export class ChatMessage {
        constructor(
            public senderId: string,
            public recepientId: string = null,
            public channelId: string,
            public message: string,
            public timeStamp: string,
            public senderNicName: string) {
    }
}
