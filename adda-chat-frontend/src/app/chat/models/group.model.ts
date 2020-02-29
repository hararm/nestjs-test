import {IGroup} from '../../../../../shared/chat-group';
import {Account} from './account.model';
export class  Group implements IGroup {
  _id: string;
  image: any;
  members: any[];
  groupName: string;
  clinicName: string;
}
