import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reception-dashboard',
    standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reception-dashboard.component.html',
  styleUrls: ['./reception-dashboard.component.scss']
})
export class ReceptionDashboardComponent {
 selectedAction = 'book';
  actions = ['book', 'edit', 'cancel'];
}
