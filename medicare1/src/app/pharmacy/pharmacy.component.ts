import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pharmacy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {
  
  medicines = [
    {
      name: 'Amoxicillin 500mg',
      category: 'Antibiotics',
      manufacturer: 'GSK',
      expires: 'Dec 2025',
      price: 12.50,
      stock: 120,
      status: 'In Stock'
    },
    {
      name: 'Lisinopril 20mg',
      category: 'Cardiovascular',
      manufacturer: 'Novartis',
      expires: 'Oct 2025',
      price: 22.75,
      stock: 15,
      status: 'Low Stock'
    },
    {
      name: 'Metformin 850mg',
      category: 'Antidiabetics',
      manufacturer: 'Pfizer',
      expires: 'Nov 2025',
      price: 18.30,
      stock: 78,
      status: 'In Stock'
    },
    {
      name: 'Vitamin D3 1000 IU',
      category: 'Vitamins & Supplements',
      manufacturer: 'Bayer',
      expires: 'Jan 2026',
      price: 15.99,
      stock: 200,
      status: 'In Stock'
    },
    {
      name: 'Ibuprofen 400mg',
      category: 'Analgesics',
      manufacturer: 'Roche',
      expires: 'Sep 2025',
      price: 9.25,
      stock: 8,
      status: 'Low Stock'
    },
    {
      name: 'Losartan 50mg',
      category: 'Antihypertensives',
      manufacturer: 'Merck',
      expires: 'Mar 2026',
      price: 19.25,
      stock: 65,
      status: 'In Stock'
    },
    {
      name: 'Insulin Glargine 100 U/mL',
      category: 'Antidiabetics',
      manufacturer: 'Sanofi',
      expires: 'Sep 2025',
      price: 140.25,
      stock: 12,
      status: 'Low Stock'
    },
    {
      name: 'Atorvastatin 40mg',
      category: 'Cardiovascular',
      manufacturer: 'Pfizer',
      expires: 'Aug 2025',
      price: 32.80,
      stock: 45,
      status: 'In Stock'
    },
    {
      name: 'Cetirizine 10mg',
      category: 'Antihistamines',
      manufacturer: 'GSK',
      expires: 'Feb 2026',
      price: 14.25,
      stock: 88,
      status: 'In Stock'
    },
    {
      name: 'Paracetamol 500mg',
      category: 'Analgesics',
      manufacturer: 'Sanofi',
      expires: 'Feb 2026',
      price: 7.00,
      stock: 200,
      status: 'In Stock'
    },
    {
      name: 'Amlodipine 5mg',
      category: 'Antihypertensives',
      manufacturer: 'Pfizer',
      expires: 'Dec 2025',
      price: 16.50,
      stock: 100,
      status: 'In Stock'
    },
    {
      name: 'Levothyroxine 50mcg',
      category: 'Thyroid Medications',
      manufacturer: 'AbbVie',
      expires: 'Jan 2026',
      price: 20.00,
      stock: 30,
      status: 'Low Stock'
    },
    {
      name: 'Simvastatin 20mg',
      category: 'Cardiovascular',
      manufacturer: 'Merck',
      expires: 'Mar 2026',
      price: 18.75,
      stock: 50,
      status: 'In Stock'
    },
    {
      name: 'Prednisolone 5mg',
      category: 'Anti-inflammatory',
      manufacturer: 'Pfizer',
      expires: 'Apr 2026',
      price: 18.50,
      stock: 25,
      status: 'Low Stock'
    },
    {
      name: 'Ranitidine 150mg',
      category: 'Antacids',
      manufacturer: 'GSK',
      expires: 'May 2026',
      price: 10.00,
      stock: 150,
      status: 'In Stock'
    }
  ];

  filteredMedicines = [...this.medicines];
  activeTab = 'all-medicines';
  
  selectedOrder = {
    medicineName: '',
    quantity: 1,
    patientId: '',
    prescriptionId: '',
    address: '',
    notes: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  filterMedicines(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredMedicines = this.medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchTerm) ||
      medicine.category.toLowerCase().includes(searchTerm) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm)
    );
  }

  filterByCategory(event: any): void {
    const category = event.target.value;
    if (category === '') {
      this.filteredMedicines = [...this.medicines];
    } else {
      this.filteredMedicines = this.medicines.filter(medicine => 
        medicine.category.toLowerCase().includes(category.toLowerCase())
      );
    }
  }

  filterByAvailability(event: any): void {
    const availability = event.target.value;
    if (availability === '') {
      this.filteredMedicines = [...this.medicines];
    } else {
      let statusFilter = '';
      switch (availability) {
        case 'in-stock':
          statusFilter = 'In Stock';
          break;
        case 'low-stock':
          statusFilter = 'Low Stock';
          break;
        case 'out-of-stock':
          statusFilter = 'Out of Stock';
          break;
      }
      this.filteredMedicines = this.medicines.filter(medicine => 
        medicine.status === statusFilter
      );
    }
  }

  filterByManufacturer(event: any): void {
    const manufacturer = event.target.value;
    if (manufacturer === '') {
      this.filteredMedicines = [...this.medicines];
    } else {
      this.filteredMedicines = this.medicines.filter(medicine => 
        medicine.manufacturer.toLowerCase().includes(manufacturer.toLowerCase())
      );
    }
  }

  clearFilters(): void {
    this.filteredMedicines = [...this.medicines];
    // Reset form controls
    const categorySelect = document.getElementById('category') as HTMLSelectElement;
    const availabilitySelect = document.getElementById('availability') as HTMLSelectElement;
    const manufacturerSelect = document.getElementById('manufacturer') as HTMLSelectElement;
    const searchInput = document.querySelector('.search-bar') as HTMLInputElement;
    
    if (categorySelect) categorySelect.value = '';
    if (availabilitySelect) availabilitySelect.value = '';
    if (manufacturerSelect) manufacturerSelect.value = '';
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

    // Filter medicines based on tab
    switch (target) {
      case 'prescriptions':
        // Filter for prescription medicines (could be based on category or other criteria)
        this.filteredMedicines = this.medicines.filter(medicine => 
          ['Antibiotics', 'Cardiovascular', 'Antidiabetics'].includes(medicine.category)
        );
        break;
      case 'recent':
        // Filter for recently added medicines (could be based on date added)
        this.filteredMedicines = this.medicines.filter(medicine => 
          ['Vitamin D3 1000 IU', 'Atorvastatin 40mg'].includes(medicine.name)
        );
        break;
      case 'expiring':
        // Filter for medicines expiring soon
        this.filteredMedicines = this.medicines.filter(medicine => 
          medicine.expires.includes('2025') && !medicine.expires.includes('Dec')
        );
        break;
      default:
        this.filteredMedicines = [...this.medicines];
    }
  }

  openOrderModal(medicineName: string): void {
    this.selectedOrder.medicineName = medicineName;
    const modal = document.getElementById('orderModal');
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

  submitOrder(): void {
    console.log('Order Submitted:', this.selectedOrder);
    // Here you would typically send the data to a service
    alert('Order submitted successfully!');
    this.closeModal('orderModal');
    this.resetOrderForm();
  }

  resetOrderForm(): void {
    this.selectedOrder = {
      medicineName: '',
      quantity: 1,
      patientId: '',
      prescriptionId: '',
      address:'',
      notes: ''
    };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In Stock':
        return 'status-available';
      case 'Low Stock':
        return 'status-low';
      case 'Out of Stock':
        return 'status-out';
      default:
        return '';
    }
  }
}
