import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIDrivenPageComponent } from './ai-driven-page.component';

describe('AIDrivenPageComponent', () => {
  let component: AIDrivenPageComponent;
  let fixture: ComponentFixture<AIDrivenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AIDrivenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIDrivenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
