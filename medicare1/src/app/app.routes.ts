import { Routes } from '@angular/router';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pharmacy', pathMatch: 'full' },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'laboratory', component: LaboratoryComponent },
  { path: '**', redirectTo: '/pharmacy' }
];
