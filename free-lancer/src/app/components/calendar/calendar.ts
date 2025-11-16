import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MeetingForm } from '../../modals/meeting-form/meeting-form';
import { Meeting } from '../../interface/meeting.model';
import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatSnackBarModule, MatIconModule,
    MatButtonModule, MatDialogModule, MatListModule,
    MatDatepickerModule, // <-- Import principal
    MatCardModule       // <-- Import principal
],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  // Injeções
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Signals
  public isLoading = signal(true);
  public selectedDate = signal<Date | null>(new Date());
  
  // "Master list" de todas as reuniões
  private allMeetings = signal<Meeting[]>([]); 
  private currentUser = this.authService.currentUser()!;

  /**
   * Signal COMPUTADO: Filtra a master list
   * baseado no 'selectedDate()'
   */
  public meetingsForSelectedDay = computed(() => {
    const meetings = this.allMeetings();
    const selected = this.selectedDate();
    
    if (!selected) return [];

    // Formata a data selecionada (ex: "2025-11-16")
    const selectedDateString = selected.toISOString().split('T')[0];
    
    return meetings
      .filter(m => m.date === selectedDateString)
      .sort((a, b) => a.time.localeCompare(b.time)); // Ordena por hora
  });

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.isLoading.set(true);
    this.meetingService.getMeetingsForUser(this.currentUser.id).subscribe({
      next: (meetings) => {
        this.allMeetings.set(meetings);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar agenda.', 'Fechar', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Chamado pelo (dateChange) do mat-calendar
   */
  onDateChange(event: Date | null): void {
    this.selectedDate.set(event);
  }

  /**
   * Abre o modal para adicionar um novo evento
   */
  openAddMeetingModal(): void {
    const dialogRef = this.dialog.open(MeetingForm, {
      width: '450px',
      data: this.selectedDate() // Passa a data selecionada para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      // 'result' é a nova reunião se foi criada com sucesso
      if (result) {
        // Adiciona a nova reunião à "master list"
        this.allMeetings.update(meetings => [...meetings, result]);
      }
    });
  }
}
