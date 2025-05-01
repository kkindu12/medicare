import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emr',
  imports: [ CommonModule, FormsModule],
  templateUrl: './emr.component.html',
  styleUrl: './emr.component.css'
})
export class EmrComponent {
   // Search and filter variables
  searchQuery: string = '';
  filterCondition: string = '';
  filterDoctor: string = '';
  filterDate: string = '';

  // Sample patient records data
  records = [
    { patientName: 'John Doe', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-15', status: 'Stable' },
    { patientName: 'Jane Smith', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-10', status: 'Critical' },
    { patientName: 'Emily Johnson', condition: 'Asthma', doctor: 'Dr. Sunil Jayathilake', lastVisit: '2025-02-20', status: 'Stable' },
    { patientName: 'Michael Brown', condition: 'Diabetes', doctor: 'Dr. Samantha Kumara', lastVisit: '2025-04-01', status: 'Stable' },
    { patientName: 'Sarah Davis', condition: 'Hypertension', doctor: 'Dr. Piyal Kodikara', lastVisit: '2025-03-25', status: 'Critical' },
  ];

  // Computed property for filtered records
  get filteredRecords() {
    return this.records.filter(record => {
      const matchesSearch = this.searchQuery
        ? record.patientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          record.condition.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCondition = this.filterCondition ? record.condition === this.filterCondition : true;
      const matchesDoctor = this.filterDoctor ? record.doctor === this.filterDoctor : true;
      const matchesDate = this.filterDate ? record.lastVisit.includes(this.filterDate) : true;
      return matchesSearch && matchesCondition && matchesDoctor && matchesDate;
    });
  }

  // Clear filters
  clearFilters() {
    this.searchQuery = '';
    this.filterCondition = '';
    this.filterDoctor = '';
    this.filterDate = '';
  }
}
