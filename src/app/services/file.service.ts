import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getSongs(data: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/practice/file/getSongs/' + data);
  }

  loadSongs(data: any): Observable<any> {
    return this.http.put(environment.apiRoot + '/practice/file/loadSongs', data);
  }

  changeStatus(data: any): Observable<any> {
    return this.http.get(environment.apiRoot + '/practice/file/changeStatus/' + data.id + '/' + data.date);
  }

  editSong(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/practice/file/editSong', data);
  }

  editCategory(data: any): Observable<any> {
    return this.http.post(environment.apiRoot + '/practice/file/editCategory', data);
  }

  deleteSong(data: any): Observable<any> {
    return this.http.delete(environment.apiRoot + '/practice/file/deleteSong/' + data.id);
  }

  deleteCategory(data: any): Observable<any> {
    return this.http.delete(environment.apiRoot + '/practice/file/deleteCategory/' + data.id);
  }
}
