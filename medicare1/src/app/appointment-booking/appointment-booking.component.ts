import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  experience: number;
  availableSlots: string[];
}

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  searchQuery: string = '';
  selectedSpecialty: string = '';
  selectedLocation: string = '';
  selectedTimeSlot: string = '';
  showAllResults: boolean = true;
  
  specialties: string[] = [
    'Cardiologist',
    'Dermatologist',
    'Family Medicine',
    'Neurologist',
    'Orthopedic Surgeon',
    'Pediatrician'
  ];

  locations: string[] = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ'
  ];

  timeSlots: string[] = [
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)'
  ];

  // Mock data for doctors
  private allDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. John Smith',
      specialty: 'Cardiologist',
      location: 'New York, NY',
      rating: 4.8,
      experience: 15,
      availableSlots: ['9:00 AM', '10:00 AM', '2:00 PM']
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      specialty: 'Dermatologist',
      location: 'Los Angeles, CA',
      rating: 4.9,
      experience: 12,
      availableSlots: ['11:00 AM', '1:00 PM', '3:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      specialty: 'Family Medicine',
      location: 'Chicago, IL',
      rating: 4.7,
      experience: 10,
      availableSlots: ['9:30 AM', '11:30 AM', '4:00 PM']
    }
  ];

  searchResults: Doctor[] = [];
  bookedAppointments: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.searchResults = this.allDoctors;
  }

  searchDoctors(): void {
    let filteredResults = this.allDoctors.filter(doctor => {
      const matchesSearch = !this.searchQuery || 
        doctor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesSpecialty = !this.selectedSpecialty || 
        doctor.specialty === this.selectedSpecialty;

      const matchesLocation = !this.selectedLocation || 
        doctor.location === this.selectedLocation;

      const matchesTimeSlot = !this.selectedTimeSlot || 
        doctor.availableSlots.some(slot => {
          const hour = parseInt(slot.split(':')[0]);
          if (this.selectedTimeSlot.includes('Morning')) {
            return hour >= 9 && hour < 12;
          } else if (this.selectedTimeSlot.includes('Afternoon')) {
            return hour >= 12 && hour < 16;
          } else if (this.selectedTimeSlot.includes('Evening')) {
            return hour >= 16 && hour < 20;
          }
          return false;
        });

      return matchesSearch && matchesSpecialty && matchesLocation && matchesTimeSlot;
    });

    // Limit results to 10 if showAllResults is false
    this.searchResults = this.showAllResults ? filteredResults : filteredResults.slice(0, 10);
  }

  toggleShowAll(): void {
    this.showAllResults = !this.showAllResults;
    this.searchDoctors();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedSpecialty = '';
    this.selectedLocation = '';
    this.selectedTimeSlot = '';
    this.searchDoctors();
  }

  bookAppointment(doctor: Doctor, timeSlot: string): void {
    // Here you would typically navigate to a booking confirmation page
    // or open a modal to confirm the booking
    console.log(`Booking appointment with ${doctor.name} at ${timeSlot}`);
    // For now, we'll just navigate to the my-appointments page
    this.router.navigate(['/my-appointments']);
  }
}