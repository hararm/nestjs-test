export interface IChatMessage {
    senderId: string;
    recipientId: string;
    channelId: string;
    message: string;
    timeStamp: string;
    senderNicName: string;
}
