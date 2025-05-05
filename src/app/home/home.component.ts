import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  welcomeMessage = 'Welcome to Medicare';
  
  services = [
    {
      title: 'Primary Care',
      description: 'Comprehensive healthcare services for individuals and families, including regular check-ups and preventive care.',
      icon: 'bi-heart-pulse'
    },
    {
      title: 'Specialist Care',
      description: 'Expert medical care from our team of specialists across various medical disciplines.',
      icon: 'bi-person-badge'
    },
    {
      title: 'Emergency Care',
      description: '24/7 emergency medical services with state-of-the-art facilities and experienced staff.',
      icon: 'bi-ambulance'
    }
  ];

  features = [
    {
      title: 'Expert Doctors',
      description: 'Highly qualified and experienced medical professionals',
      icon: 'bi-people-fill'
    },
    {
      title: '24/7 Service',
      description: 'Round-the-clock medical assistance',
      icon: 'bi-clock-fill'
    },
    {
      title: 'Easy Location',
      description: 'Conveniently located facilities',
      icon: 'bi-geo-alt-fill'
    },
    {
      title: 'Quality Care',
      description: 'Patient-centered healthcare approach',
      icon: 'bi-heart-fill'
    }
  ];
} 