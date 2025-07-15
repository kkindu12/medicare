import { Routes } from '@angular/router';
import { ReceptionDashboardComponent } from './reception-dashboard/reception-dashboard.component';
 

export const routes: Routes = [
     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // ✅ default route
  { path: 'dashboard', component: ReceptionDashboardComponent }
];
