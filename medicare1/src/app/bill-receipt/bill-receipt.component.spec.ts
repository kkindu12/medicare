import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReceiptComponent } from './bill-receipt.component';

describe('BillReceiptComponent', () => {
  let component: BillReceiptComponent;
  let fixture: ComponentFixture<BillReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
