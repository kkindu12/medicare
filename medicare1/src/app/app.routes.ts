import { Routes } from '@angular/router';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { BillReceiptComponent } from './bill-receipt/bill-receipt.component';

export const routes: Routes = [
     { path: '', redirectTo: 'create-bill', pathMatch: 'full' },
    { path: 'create-bill', component: CreateBillComponent },
  { path: 'bill-receipt', component: BillReceiptComponent },
   
];
