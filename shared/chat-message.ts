export class ChatMessage {
        constructor(
            public senderId: string,
            public channelId: string,
            public message: string,
            public timeStamp: string,
            public senderNicName: string) {
    }
}
