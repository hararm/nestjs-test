import {Injectable} from '@angular/core';
import {Group} from '../models/group.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ChatMessage} from '../models/chat-message.model';
import {GroupMember} from '../models/member.model';


@Injectable()
export class ChatHttpService {
  apiPath = environment.apiPath;

  constructor(private http: HttpClient) {
  }

  addGroup(data: FormData) {
    return this.http.post(`${this.apiPath}groups`, data);
  }

  findAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiPath}groups`)
  }

  findGroupByName(groupName: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiPath}groups/${groupName}`);
  }

  findGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiPath}groups/findGroupById/${id}`);
  }

  findMessagesGroupById(id: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiPath}messages/${id}`);
  }

  findGroupByClinicName(clinicName: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiPath}clinics/${clinicName}`);
  }

  findUsersByGroupById(id: string): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.apiPath}users/${id}`);
  }
}
