import {ChatUser} from "./chat-user";

export interface IGroup {
    _id: string;
    clinicName: string;
    groupName: string;
    image: any;
    members: ChatUser[];
}
