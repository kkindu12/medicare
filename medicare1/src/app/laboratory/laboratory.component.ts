import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent implements OnInit {
  
  tests = [
    {
      name: 'Complete Blood Count (CBC)',
      category: 'Blood Tests',
      turnaround: 'Same Day',
      location: 'Main Laboratory',
      price: 45.00
    },
    {
      name: 'Lipid Profile',
      category: 'Blood Tests',
      turnaround: '24 Hours',
      location: 'Outpatient Center',
      price: 65.00
    },
    {
      name: 'Urinalysis',
      category: 'Urine Tests',
      turnaround: 'Same Day',
      location: 'Main Laboratory',
      price: 35.00
    },
    {
      name: 'Thyroid Function Test',
      category: 'Blood Tests',
      turnaround: '48 Hours',
      location: 'Reference Lab',
      price: 85.00
    },
    {
      name: 'Comprehensive Metabolic Panel',
      category: 'Blood Tests',
      turnaround: '24 Hours',
      location: 'Main Laboratory',
      price: 105.00
    },
    {
      name: 'HbA1c',
      category: 'Blood Tests',
      turnaround: '24 Hours',
      location: 'Outpatient Center',
      price: 55.00
    }
  ];

  filteredTests = [...this.tests];
  activeTab = 'all-tests';
  
  selectedTestRequest = {
    testName: '',
    patientId: '',
    referringDoctor: '',
    urgency: 'routine',
    collectionDate: '',
    clinicalInfo: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.setCurrentDate();
  }

  setCurrentDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.selectedTestRequest.collectionDate = `${year}-${month}-${day}`;
  }

  filterTests(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTests = this.tests.filter(test => 
      test.name.toLowerCase().includes(searchTerm) ||
      test.category.toLowerCase().includes(searchTerm) ||
      test.location.toLowerCase().includes(searchTerm)
    );
  }

  filterByCategory(event: any): void {
    const category = event.target.value;
    if (category === '') {
      this.filteredTests = [...this.tests];
    } else {
      this.filteredTests = this.tests.filter(test => 
        test.category.toLowerCase().includes(category.toLowerCase())
      );
    }
  }

  filterByTurnaround(event: any): void {
    const turnaround = event.target.value;
    if (turnaround === '') {
      this.filteredTests = [...this.tests];
    } else {
      this.filteredTests = this.tests.filter(test => 
        test.turnaround.toLowerCase().includes(turnaround.toLowerCase())
      );
    }
  }

  filterByLocation(event: any): void {
    const location = event.target.value;
    if (location === '') {
      this.filteredTests = [...this.tests];
    } else {
      this.filteredTests = this.tests.filter(test => 
        test.location.toLowerCase().includes(location.toLowerCase())
      );
    }
  }

  clearFilters(): void {
    this.filteredTests = [...this.tests];
    // Reset form controls
    const categorySelect = document.getElementById('test-category') as HTMLSelectElement;
    const turnaroundSelect = document.getElementById('turnaround') as HTMLSelectElement;
    const locationSelect = document.getElementById('lab-location') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-bar') as HTMLInputElement;
    
    if (categorySelect) categorySelect.value = '';
    if (turnaroundSelect) turnaroundSelect.value = '';
    if (locationSelect) locationSelect.value = '';
    if (searchInput) searchInput.value = '';
  }

  switchTab(target: string): void {
    this.activeTab = target;
    
    // Update active tab styling
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.querySelector(`[data-target="${target}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Filter tests based on tab
    switch (target) {
      case 'common':
        this.filteredTests = this.tests.filter(test => 
          ['Complete Blood Count (CBC)', 'Lipid Profile', 'Urinalysis'].includes(test.name)
        );
        break;
      case 'special':
        this.filteredTests = this.tests.filter(test => 
          test.category === 'Special Tests' || test.turnaround === '48 Hours'
        );
        break;
      case 'panels':
        this.filteredTests = this.tests.filter(test => 
          test.name.includes('Panel') || test.name.includes('Profile')
        );
        break;
      default:
        this.filteredTests = [...this.tests];
    }
  }

  openTestRequestModal(testName: string): void {
    this.selectedTestRequest.testName = testName;
    const modal = document.getElementById('testRequestModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  submitTestRequest(): void {
    console.log('Test Request Submitted:', this.selectedTestRequest);
    // Here you would typically send the data to a service
    alert('Test request submitted successfully!');
    this.closeModal('testRequestModal');
    this.resetTestRequestForm();
  }

  resetTestRequestForm(): void {
    this.selectedTestRequest = {
      testName: '',
      patientId: '',
      referringDoctor: '',
      urgency: 'routine',
      collectionDate: '',
      clinicalInfo: ''
    };
    this.setCurrentDate();
  }
}
