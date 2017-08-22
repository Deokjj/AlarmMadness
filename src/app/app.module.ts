import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'hammerjs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
//Angular Material Animation Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule,
         MdIconModule, MdDialogModule, MdSnackBarModule, MdProgressSpinnerModule,
         MdInputModule, MdTooltipModule, MdSidenavModule, MdGridListModule,
         MdSlideToggleModule, MdSelectModule, MdChipsModule, MdPaginatorModule,
         MdProgressBarModule} from '@angular/material';

import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup,
         Validators } from '@angular/forms';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'


import { DialogComponent } from './pages/main/dialog/dialog.component';
import { HomeComponent } from './pages/home/home.component';
import { WebCamComponent } from 'ack-angular-webcam';
import { CameraComponent } from './camera/camera.component';
import { BackgroundComponent } from './background/background.component';
import { MsgSnackComponent } from './pages/home/msg-snack/msg-snack.component';
import { YoutubeSearchComponent } from './pages/home/youtube-search/youtube-search.component';
import { DiceComponent } from './pages/home/dice/dice.component';

import { FaceService } from './services/face.service';
import { UserService } from './services/user.service';
import { YoutubeService } from './services/youtube.service';
import { PostService } from './services/post.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DialogComponent,
    HomeComponent,
    WebCamComponent,
    CameraComponent,
    BackgroundComponent,
    MsgSnackComponent,
    YoutubeSearchComponent,
    DiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdMenuModule,
    MdCardModule,
    MdToolbarModule,
    MdIconModule,
    MdDialogModule,
    MdSnackBarModule,
    MdProgressSpinnerModule,
    MdInputModule,
    FormsModule,
    ReactiveFormsModule,
    MdTooltipModule,
    MdSidenavModule,
    MdGridListModule,
    MdSlideToggleModule,
    MdSelectModule,
    MdChipsModule,
    YoutubePlayerModule,
    MdPaginatorModule,
    MdProgressBarModule
  ],
  providers: [FaceService,
              UserService,
              YoutubeService,
              PostService
            ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent,
                    MsgSnackComponent,
                    YoutubeSearchComponent]
})
export class AppModule { }
