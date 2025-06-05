import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChatPageComponent } from "./components/chat-page/chat-page.component";
import { DoctorListComponent } from "./components/doctor-list/doctor-list.component";

const routes: Routes = [
    { path: 'chat-page', component: ChatPageComponent },
    { path: 'doctor-list', component: DoctorListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}