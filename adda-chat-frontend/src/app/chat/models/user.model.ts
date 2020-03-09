import {IUser} from '../../../../../shared/user';

export class User implements IUser {
     constructor(public _id: string, public email: string, public userName: string) {
  }
  public roles: string[];
}

export class SignUpUser extends User {
  password: string;
}
