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
    },
    {
      name: 'Vitamin D Level',
      category: 'Blood Tests',
      turnaround: '48 Hours',
      location: 'Reference Lab',
      price: 75.00
    },
    {
      name: 'Basic Metabolic Panel',
      category: 'Blood Tests',
      turnaround: 'Same Day',
      location: 'Main Laboratory',
      price: 50.00
    },
    {
      name: 'Liver Function Tests',
      category: 'Blood Tests',
      turnaround: '24 Hours',
      location: 'Main Laboratory',
      price: 60.00
    },
    {
      name: 'Urine Culture',
      category: 'Microbiology',
      turnaround: '24 Hours',
      location: 'Main Laboratory',
      price: 70.00
    },
    {
      name: 'Complete Urine Analysis',
      category: 'Urine Tests',
      turnaround: 'Same Day',
      location: 'Main Laboratory',
      price: 30.00
    },
    {
      name: 'Blood Type & Crossmatch',
      category: 'Blood Tests',
      turnaround: '24 Hours',
      location: 'Main Laboratory',
      price: 120.00
    },
    {
      name: 'Pregnancy Test (Urine)',
      category: 'Urine Tests',
      turnaround: 'Same Day',
      location: 'Outpatient Center',
      price: 100.00
    },
    {
      name: 'Coagulation Panel (PT/INR)',
      category: 'Blood Tests',
      turnaround: '48 Hours',
      location: 'Reference Lab',
      price: 90.00
    },
    {
      name: 'Strep A Rapid Test',
      category: 'Microbiology',
      turnaround: '48 Hours',
      location: 'Main Laboratory',
      price: 50.00
    }
  ];

  filteredTests = [...this.tests];
  activeTab = 'all-tests';
  selectedReferralFile: File | null = null;
  
  selectedTestRequest = {
    testName: '',
    patientId: '',
    referringDoctor: '',
    gender: '',
    collectionDate: '',
    preferredTime: '',
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
    const locationSelect = document.getElementById('lab-location') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-bar') as HTMLInputElement;
    
    if (categorySelect) categorySelect.value = '';
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
          test.category === 'special' || test.turnaround === '48 Hours'
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
    // Reset file when closing modal
    this.selectedReferralFile = null;
    const fileInput = document.getElementById('doctorReferral') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  submitTestRequest(): void {
    console.log('Test Request Submitted:', this.selectedTestRequest);

    // Handle file upload if a file is selected
    if (this.selectedReferralFile) {
      console.log('Doctor referral uploaded:', this.selectedReferralFile);
      // Here you would typically upload the file to a server
      // Example: this.uploadReferralFile(this.selectedReferralFile);
    }
    
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
      gender: '',
      collectionDate: '',
      preferredTime: '',
      clinicalInfo: ''
    };
    // Reset file selection
    this.selectedReferralFile = null;
    const fileInput = document.getElementById('doctorReferral') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }    this.setCurrentDate();
  }

  // File upload methods for doctor's referral
  onReferralFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        event.target.value = ''; // Clear the input
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file format (PDF, JPG, JPEG, PNG, GIF)');
        event.target.value = ''; // Clear the input
        return;
      }
      
      this.selectedReferralFile = file;
    }
  }

  removeReferralFile(): void {
    this.selectedReferralFile = null;
    const fileInput = document.getElementById('doctorReferral') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
