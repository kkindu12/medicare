import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChatPageComponent } from '../chat-page/chat-page.component';


@Component({
  selector: 'app-doctor-list',
  imports: [CommonModule, RouterModule,ChatPageComponent],
  standalone: true,
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})

export class DoctorListComponent {

  currentComponent: string = 'chat-page';

   changeChatPage(tabName: string){
    this.currentComponent=tabName;

   }
  
}








