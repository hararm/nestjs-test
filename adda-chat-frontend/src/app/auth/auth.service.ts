import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './model/user.model';
import {environment} from '../../environments/environment';


@Injectable()
export class AuthService {
    apiPath = environment.apiPath;
    constructor(private http:HttpClient) {
    }

    login(email:string, password:string): Observable<User> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
        return this.http.post<User>(`${this.apiPath}login`, {email,password}, httpOptions);
    }

}
