import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserDocument } from '../../interface/document.model';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteProject } from '../../modals/delete-project/delete-project';

@Component({
  selector: 'app-documents',
  imports: [
    CommonModule, 
    DatePipe, // Adicionar DatePipe
    MatButtonModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatListModule,
    MatSnackBarModule,
    MatDialogModule // 2. ADICIONAR O MatDialogModule
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  public documents = signal<UserDocument[]>([]);
  public isLoading = signal(true);
  public isUploading = signal(false);

  ngOnInit(): void {
    this.loadDocuments();
  }
  
  private user = this.authService.currentUser()!;


  loadDocuments(): void {
    this.isLoading.set(true);
    
    // --- CORREÇÃO AQUI ---
    // 1. Buscamos o usuário no momento exato que precisamos dele
    const currentUser = this.authService.currentUser();

    // 2. Verificamos se ele existe
    if (currentUser) {
      this.storageService.getDocuments(currentUser.id).subscribe(docs => {
        this.documents.set(docs);
        this.isLoading.set(false);
      });
    } else {
      // 3. Caso seguro, se o usuário for nulo
      this.snackBar.open('Erro: Usuário não encontrado.', 'Fechar', { duration: 3000 });
      this.isLoading.set(false);
    }
  }

  /**
   * Chamado quando o usuário seleciona um arquivo no input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    // Validação simples de tamanho (ex: max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.snackBar.open('Arquivo muito grande (máx 10MB).', 'Fechar', { duration: 3000 });
      return;
    }
    

    this.isUploading.set(true);

    this.storageService.uploadDocument(file).subscribe({
      next: (newDoc) => {
        this.documents.update(docs => [...docs, newDoc]);
        this.snackBar.open('Documento enviado com sucesso!', 'OK', { duration: 3000 });
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erro ao enviar documento.', 'Fechar', { duration: 3000 });
        this.isUploading.set(false);
      }
    });
  }

  /**
   * Deleta um documento
   */
  deleteDocument(doc: UserDocument): void {
    // 1. Abre o modal genérico que você já tem
    const dialogRef = this.dialog.open(DeleteProject, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o documento "${doc.fileName}"?`,
        confirmButtonText: 'Excluir',
        confirmButtonColor: 'warn' // Deixa o botão vermelho
      }
    });

    // 2. Escuta o resultado do modal
    dialogRef.afterClosed().subscribe(result => {
      // O modal retorna 'true' se o usuário clicou em "Excluir"
      if (result === true) {
        // 3. Se confirmou, executa a lógica de exclusão
        this.storageService.deleteDocument(doc).subscribe({
          next: () => {
            this.documents.update(docs => docs.filter(d => d.id !== doc.id));
            this.snackBar.open('Documento excluído.', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Erro ao excluir documento.', 'Fechar', { duration: 3000 });
          }
        });
      }
      // Se 'result' não for 'true' (ex: clicou em "Cancelar" ou fora),
      // nada acontece, que é o esperado.
    });
  }
}
