import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting } from '../interface/meeting.model';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private http = inject(HttpClient);
  private dbUrl = 'http://localhost:3000/meetings';

  /**
   * Busca todas as reuniões de um usuário específico
   */
  getMeetingsForUser(userId: string | number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.dbUrl}?userId=${userId}`);
  }

  /**
   * Adiciona uma nova reunião
   */
  addMeeting(meeting: Omit<Meeting, 'id'>): Observable<Meeting> {
    return this.http.post<Meeting>(this.dbUrl, meeting);
  }
}