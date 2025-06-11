import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Prescription, PharmacyStats } from '../models/prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private prescriptionsSubject = new BehaviorSubject<Prescription[]>([]);
  private statsSubject = new BehaviorSubject<PharmacyStats>({
    pendingPrescriptions: 0,
    labTestRequests: 0,
    outOfStockItems: 0,
    reportsUploaded: 0
  });

  prescriptions$ = this.prescriptionsSubject.asObservable();
  stats$ = this.statsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const mockPrescriptions: Prescription[] = [
      {
        id: '1',
        patientName: 'John Smith',
        medication: 'Amoxicillin 500mg',
        doctor: 'Dr. Sarah Johnson',
        patientId: '#12345',
        status: 'PENDING',
        time: '2:30 PM',
        date: '2025-06-11',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '7 days',
        notes: 'Take with food'
      },
      {
        id: '2',
        patientName: 'Maria Garcia',
        medication: 'Insulin Rapid-Acting',
        doctor: 'Dr. Michael Chen',
        patientId: '#12346',
        status: 'URGENT',
        time: '1:15 PM',
        date: '2025-06-11',
        dosage: '10 units',
        frequency: 'Before meals',
        duration: 'Ongoing',
        notes: 'Monitor blood glucose levels'
      },
      {
        id: '3',
        patientName: 'Robert Johnson',
        medication: 'Lisinopril 10mg',
        doctor: 'Dr. Emily Davis',
        patientId: '#12347',
        status: 'PENDING',
        time: '11:45 AM',
        date: '2025-06-11',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days'
      }
    ];

    const mockStats: PharmacyStats = {
      pendingPrescriptions: 12,
      labTestRequests: 8,
      outOfStockItems: 3,
      reportsUploaded: 15
    };

    this.prescriptionsSubject.next(mockPrescriptions);
    this.statsSubject.next(mockStats);
  }

  getPrescriptions(): Observable<Prescription[]> {
    return this.prescriptions$;
  }

  getPharmacyStats(): Observable<PharmacyStats> {
    return this.stats$;
  }

  updatePrescriptionStatus(prescriptionId: string, status: Prescription['status']): Observable<boolean> {
    const currentPrescriptions = this.prescriptionsSubject.getValue();
    const updatedPrescriptions = currentPrescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status } 
        : prescription
    );
    
    this.prescriptionsSubject.next(updatedPrescriptions);
    this.updateStats();
    
    return of(true);
  }

  addPrescription(prescription: Omit<Prescription, 'id'>): Observable<Prescription> {
    const newPrescription: Prescription = {
      ...prescription,
      id: this.generateId()
    };
    
    const currentPrescriptions = this.prescriptionsSubject.getValue();
    this.prescriptionsSubject.next([...currentPrescriptions, newPrescription]);
    this.updateStats();
    
    return of(newPrescription);
  }

  deletePrescription(prescriptionId: string): Observable<boolean> {
    const currentPrescriptions = this.prescriptionsSubject.getValue();
    const filteredPrescriptions = currentPrescriptions.filter(p => p.id !== prescriptionId);
    
    this.prescriptionsSubject.next(filteredPrescriptions);
    this.updateStats();
    
    return of(true);
  }

  searchPrescriptions(searchTerm: string): Observable<Prescription[]> {
    const currentPrescriptions = this.prescriptionsSubject.getValue();
    const filtered = currentPrescriptions.filter(prescription =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.includes(searchTerm)
    );
    
    return of(filtered);
  }

  private updateStats(): void {
    const prescriptions = this.prescriptionsSubject.getValue();
    const stats: PharmacyStats = {
      pendingPrescriptions: prescriptions.filter(p => p.status === 'PENDING').length,
      labTestRequests: 8, // This would come from another service
      outOfStockItems: 3, // This would come from inventory service
      reportsUploaded: 15 // This would come from reports service
    };
    
    this.statsSubject.next(stats);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
