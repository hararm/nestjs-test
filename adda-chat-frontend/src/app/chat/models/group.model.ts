import {IGroup} from '../../../../../shared/chat-group';
import {GroupMember} from './member.model';
export class  Group implements IGroup {
  _id: string;
  image: any;
  members: GroupMember[];
  groupName: string;
  clinicName: string;
}
