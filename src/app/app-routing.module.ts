import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { MainComponent } from './pages/main/main.component';
import { WebCamComponent } from 'ack-angular-webcam';
import { CameraComponent } from './camera/camera.component';
import { HomeComponent } from './pages/home/home.component';
import { BackgroundComponent } from './background/background.component';
import { YoutubeSearchComponent } from './pages/home/youtube-search/youtube-search.component';
import { DiceComponent } from './pages/home/dice/dice.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'youtube',
    component: YoutubeSearchComponent
  },
  {
    path: 'camera',
    component: CameraComponent
  },
  {
    path: 'dice',
    component: DiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
