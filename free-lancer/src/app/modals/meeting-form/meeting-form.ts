import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Meeting } from '../../interface/meeting.model';
import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './meeting-form.html',
  styleUrl: './meeting-form.scss',
})
export class MeetingForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MeetingForm>);
  private snackBar = inject(MatSnackBar);
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  
  // Recebe a DATA (ex: new Date()) que o usuário clicou
  public selectedDate: Date = inject(MAT_DIALOG_DATA);
  
  public meetingForm!: FormGroup;
  private currentUser = this.authService.currentUser()!;

  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      title: ['', [Validators.required]],
      time: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]] // Valida "HH:MM"
    });
  }

  onSubmit(): void {
    if (this.meetingForm.invalid) {
      this.meetingForm.markAllAsTouched();
      return;
    }

    const formValues = this.meetingForm.value;

    const newMeeting: Omit<Meeting, 'id'> = {
      userId: this.currentUser.id,
      title: formValues.title,
      time: formValues.time,
      // Formata a data para YYYY-MM-DD
      date: this.selectedDate.toISOString().split('T')[0] 
    };

    this.meetingService.addMeeting(newMeeting).subscribe({
      next: (meeting) => {
        this.snackBar.open('Reunião agendada!', 'OK', { duration: 3000 });
        this.dialogRef.close(meeting); // Retorna a reunião
      },
      error: (err) => {
        this.snackBar.open('Erro ao agendar.', 'Fechar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
