import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule,MatCardModule, MatDatepickerModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  selected: Date | null = new Date();
}
