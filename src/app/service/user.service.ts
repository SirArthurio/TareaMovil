import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from './BaseApi';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Task } from '../model/Task';

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
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' 
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Error:', error.error.message);
    } else {
      console.error(`Código de estado: ${error.status}, Body: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }

  public Tareas(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}tareas/`, { 
      headers: this.getHeaders(),
      observe: 'response' 
    }).pipe(
      catchError(this.handleError),
      map(response => {
        if (!response.body) {
          throw new Error('La respuesta del servidor está vacía');
        }
        return response.body;
      })
    );
  }

  public Tarea(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API}tareas/${id}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  public crearTarea(data: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API}tareas/`, data, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }
  public actualizarTarea(data: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.API}tareas/${data.id}`, data, {
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
      .delete<Task>(`${this.API}tareas/${id}`, { headers: this.headers })
      .pipe(
        catchError((error) => {
          console.log('error:', error);
          return throwError(() => error);
        })
      );
  }
}
