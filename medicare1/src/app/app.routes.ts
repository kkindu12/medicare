import { Routes } from '@angular/router';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { BillReceiptComponent } from './bill-receipt/bill-receipt.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'create-bill', pathMatch: 'full' },
  { path: 'create-bill', component: CreateBillComponent },
  { path: 'bill-receipt', component: BillReceiptComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'payment', component: PaymentComponent },
];
