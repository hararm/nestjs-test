import {Injectable} from '@angular/core';
import {Group} from '../models/group.model';
import {environment} from '../../../../../frontend/src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


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

  findGroupByClinicName(clinicName: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiPath}clinics/${clinicName}`);
  }
}
