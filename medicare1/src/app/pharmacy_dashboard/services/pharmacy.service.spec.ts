import { TestBed } from '@angular/core/testing';
import { PharmacyService } from './pharmacy.service';

describe('PharmacyService', () => {
  let service: PharmacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmacyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial prescriptions', (done) => {
    service.getPrescriptions().subscribe(prescriptions => {
      expect(prescriptions.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have initial pharmacy stats', (done) => {
    service.getPharmacyStats().subscribe(stats => {
      expect(stats.pendingPrescriptions).toBeGreaterThanOrEqual(0);
      expect(stats.labTestRequests).toBeGreaterThanOrEqual(0);
      expect(stats.outOfStockItems).toBeGreaterThanOrEqual(0);
      expect(stats.reportsUploaded).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should update prescription status', (done) => {
    service.updatePrescriptionStatus('1', 'COMPLETED').subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should search prescriptions', (done) => {
    service.searchPrescriptions('John').subscribe(results => {
      expect(results.length).toBeGreaterThanOrEqual(0);
      done();
    });
  });
});
