import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from './BaseApi';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  API = environment.API_URL;
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  });

  public Tareas(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.API}/tareas/`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public Tarea(id: number): Observable<Task> {
    return this.http
      .get<Task>(`${this.API}/tareas/${id}`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public crearTarea(data: Task): Observable<Task> {
    return this.http
      .post<Task>(`${this.API}/tareas`, data, { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.log('error:', error,data);
          return throwError(() => error);
        })
      );
  }
  public actualizarTarea(data: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.API}/tareas/${data.id}`, data, {
        headers: this.headers,
      })
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
  public eliminarTarea(id: number): Observable<Task> {
    return this.http
      .delete<Task>(`${this.API}/tareas/${id}`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
}
