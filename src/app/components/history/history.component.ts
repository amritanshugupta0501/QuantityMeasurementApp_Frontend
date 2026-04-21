import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  measurementService = inject(MeasurementService);

  historyData: any[] = [];
  filterOperation = 'Add';
  operations = ['Add', 'Subtract', 'Compare', 'Convert', 'Divide'];

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.measurementService.getHistoryByOperation(this.filterOperation).subscribe({
      next: (res: any) => {
        this.historyData = Array.isArray(res) ? res : [res]; // Ensure array
      },
      error: (err) => {
        console.error('Error fetching history', err);
        this.historyData = [];
      }
    });
  }
}
