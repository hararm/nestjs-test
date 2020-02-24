import {IGroup} from '../../../../../shared/chat-group';
export class  Group implements IGroup {
  _id: string;
  image: any;
  members: [];
  groupName: string;
  clinicName: string;
}
