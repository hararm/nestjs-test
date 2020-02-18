import {Injectable} from '@angular/core';
import {Group} from '../models/group.model';
import {environment} from '../../../../../frontend/src/environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChatHttpService {
  apiPath = environment.apiPath;

  constructor(private http: HttpClient) {
  }

  addGroup(data: FormData) {
    return this.http.post(`${this.apiPath}groups`, data);
  }
}
