import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/practice/members/login', data);
  }

  register(data: any): Observable<any> {
    return this.http.put(environment.apiRoot + '/practice/members/', data);
  }
}
