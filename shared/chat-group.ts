import {IGroupMember} from "./member";


export interface IGroup {
    _id: string;
    clinicName: string;
    groupName: string;
    image: any;
    members: IGroupMember[];
}
