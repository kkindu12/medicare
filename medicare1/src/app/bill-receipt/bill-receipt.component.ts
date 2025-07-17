import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-receipt',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './bill-receipt.component.html',
  styleUrls: ['./bill-receipt.component.scss']
})
export class BillReceiptComponent implements OnInit {

  bill: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedBill = localStorage.getItem('currentBill');
    if (storedBill) {
      this.bill = JSON.parse(storedBill);
    } else {
      this.router.navigate(['/create-bill']);
    }
  }

  printBill() {
    window.print();
    localStorage.removeItem('currentBill');
  }
}