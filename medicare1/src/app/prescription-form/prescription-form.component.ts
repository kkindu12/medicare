import { Component } from '@angular/core';

@Component({
  selector: 'app-prescription-form',
  imports: [],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss'
})
export class PrescriptionFormComponent {


 clickSubmit(){
  alert(" Submited.")
 }


}
