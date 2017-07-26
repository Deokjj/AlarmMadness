import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { MainComponent } from './signuplogin/main/main.component';
import { WebCamComponent } from 'ack-angular-webcam';
import { CameraComponent } from './camera/camera.component';
import { SignupComponent } from './signuplogin/signup/signup.component';
import { BackgroundComponent } from './background/background.component';
// import { LoginComponent } from './signuplogin/login/login.component';
// import { HomeComponent } from './main/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'home',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
