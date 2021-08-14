import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getFile(data: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/practice/file/getFile/' + data.user);
  }

  writeToFile(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/practice/file/writeToFile', data);
  }
}
