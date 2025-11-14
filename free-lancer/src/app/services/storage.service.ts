import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs'; // Import 'of' para simulação
import { delay, switchMap } from 'rxjs/operators';
import { UserDocument } from '../interface/document.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private dbUrl = 'http://localhost:3000/documents'; // URL do nosso db.json

  /**
   * Pega os METADADOS dos documentos do db.json
   */
  getDocuments(userId: string | number): Observable<UserDocument[]> {
    return this.http.get<UserDocument[]>(`${this.dbUrl}?userId=${userId}`);
  }

  /**
   * *** VERSÃO MOCKADA DO UPLOAD ***
   * Finge fazer o upload e salva os metadados no db.json
   */
  uploadDocument(file: File): Observable<UserDocument> {
    const user = this.authService.currentUser()!;
    
    // 1. Criamos o "payload" dos metadados
    const doc: Omit<UserDocument, 'id'> = {
      userId: user.id,
      fileName: file.name,
      fileType: file.type,
      // 2. Criamos uma URL falsa. O link não vai funcionar, mas a UI sim.
      downloadUrl: `http://fake-storage.com/user_documents/${user.id}/${file.name}`,
      uploadedAt: new Date().toISOString()
    };

    // 3. Simula um delay de upload (1.5 segundos) e salva no db.json
    return of(null).pipe( // Inicia um Observable "vazio"
      delay(1500), // Finge que está fazendo upload
      switchMap(() => {
        // 4. Salva os metadados no json-server
        return this.http.post<UserDocument>(this.dbUrl, doc);
      })
    );
  }

  /**
   * Deleta o documento (só precisa deletar do db.json)
   */
  deleteDocument(doc: UserDocument): Observable<any> {
    // Como não há arquivo real, só deletamos a referência no db.json
    return this.http.delete(`${this.dbUrl}/${doc.id}`);
  }
}