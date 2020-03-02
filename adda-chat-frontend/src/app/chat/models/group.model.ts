import {IGroup} from '../../../../../shared/chat-group';
import {Account} from './account.model';
export class  Group implements IGroup {
  public _id: string;
  public image: any;
  public members: any[];
  public groupName: string;
  public clinicName: string;
  public isPrivate: boolean;
}
