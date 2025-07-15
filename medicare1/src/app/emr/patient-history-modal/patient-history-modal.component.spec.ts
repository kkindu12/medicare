import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientHistoryModalComponent } from './patient-history-modal.component';
import type { PatientRecordWithUser } from '../models';

describe('PatientHistoryModalComponent', () => {
  let component: PatientHistoryModalComponent;
  let fixture: ComponentFixture<PatientHistoryModalComponent>;

  const mockRecord: PatientRecordWithUser = {
    id: '1',
    visitDate: '2025-06-01',
    visitTime: '10:00',
    condition: 'Diabetes',
    doctor: 'Dr. Test',
    prescription: 'Test prescription',
    status: 'Stable',
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      password: 'password',
      role: true
    }
  };

  const mockRecords: PatientRecordWithUser[] = [mockRecord];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHistoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientHistoryModalComponent);
    component = fixture.componentInstance;
    component.selectedPatientRecord = mockRecord;
    component.previousPatientRecords = mockRecords;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display patient name in modal title', () => {
    component.showPreviousRecords = true;
    component.selectedPatientRecord = mockRecord;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal-title')?.textContent).toContain('John Doe');
  });

  it('should emit closePreviousRecords when close button is clicked', () => {
    spyOn(component.closePreviousRecords, 'emit');
    component.onClose();
    expect(component.closePreviousRecords.emit).toHaveBeenCalled();
  });

  it('should display previous records when available', () => {
    component.showPreviousRecords = true;
    component.previousPatientRecords = mockRecords;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table')).toBeTruthy();
    expect(compiled.querySelector('tbody tr')).toBeTruthy();
  });

  it('should display no records message when empty', () => {
    component.showPreviousRecords = true;
    component.previousPatientRecords = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-muted')?.textContent).toContain('No previous records found');
  });

  it('should show modal when showPreviousRecords is true', () => {
    component.showPreviousRecords = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const modal = compiled.querySelector('.modal');
    expect(modal?.classList.contains('show')).toBeTruthy();
  });

  it('should hide modal when showPreviousRecords is false', () => {
    component.showPreviousRecords = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const modal = compiled.querySelector('.modal');
    expect(modal?.classList.contains('show')).toBeFalsy();
  });
});
