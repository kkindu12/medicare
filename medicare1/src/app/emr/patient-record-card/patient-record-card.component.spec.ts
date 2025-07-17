import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientRecordCardComponent } from './patient-record-card.component';
import type { PatientRecordWithUser } from '../models';

describe('PatientRecordCardComponent', () => {
  let component: PatientRecordCardComponent;
  let fixture: ComponentFixture<PatientRecordCardComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRecordCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientRecordCardComponent);
    component = fixture.componentInstance;
    component.record = mockRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editRecord event when edit button is clicked', () => {
    spyOn(component.editRecord, 'emit');
    component.onEditRecord();
    expect(component.editRecord.emit).toHaveBeenCalledWith(mockRecord);
  });

  it('should emit addReport event when add report button is clicked', () => {
    spyOn(component.addReport, 'emit');
    component.onAddReport();
    expect(component.addReport.emit).toHaveBeenCalledWith(mockRecord);
  });

  it('should emit viewHistory event when view history button is clicked', () => {
    spyOn(component.viewHistory, 'emit');
    component.onViewHistory();
    expect(component.viewHistory.emit).toHaveBeenCalledWith(mockRecord);
  });
});
