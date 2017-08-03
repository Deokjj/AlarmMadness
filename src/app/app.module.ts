// import 'youtube';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import 'hammerjs';
// import 'aws-sdk/clients/s3';ß

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './signuplogin/main/main.component';
//Angular Material Animation Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule,
         MdIconModule, MdDialogModule, MdSnackBarModule, MdProgressSpinnerModule,
         MdInputModule, MdTooltipModule, MdSidenavModule, MdGridListModule,
         MdSlideToggleModule, MdSelectModule, MdChipsModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup,
         Validators } from '@angular/forms';
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'


import { DialogComponent } from './signuplogin/main/dialog/dialog.component';
import { SignupComponent } from './signuplogin/signup/signup.component';
import { WebCamComponent } from 'ack-angular-webcam';
import { CameraComponent } from './camera/camera.component';
import { BackgroundComponent } from './background/background.component';
import { MsgSnackComponent } from './signuplogin/signup/msg-snack/msg-snack.component';
import { LoginComponent } from './signuplogin/login/login.component';
import { HomeComponent } from './main/home/home.component';

import { FaceService } from './services/face.service';
import { UserService } from './services/user.service';
// import { AwsService } from './services/aws.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DialogComponent,
    SignupComponent,
    WebCamComponent,
    CameraComponent,
    BackgroundComponent,
    MsgSnackComponent,
    LoginComponent,
    HomeComponent
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
    YoutubePlayerModule
  ],
  providers: [FaceService,
              UserService,
              // AwsService
            ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent,
                    MsgSnackComponent]
})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
