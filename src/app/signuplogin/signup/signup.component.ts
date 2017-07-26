import * as jQuery from 'jquery';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraComponent } from '../../camera/camera.component';
import { BackgroundComponent } from '../../background/background.component';
import { MdSnackBar } from '@angular/material';
import { MsgSnackComponent } from './msg-snack/msg-snack.component';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

// import { SnackServiceService } from './msg-snack/snack-service.service';

const NAME_REGEX = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild(CameraComponent) cameraComponent: CameraComponent;
  @ViewChild(BackgroundComponent) background : BackgroundComponent;
  // input initializing
  nameInput: string;
  passwordInput : string;
  //

  // Page view conditions
  currentUser: any = {};
  loggedIn: boolean = false;
  toSignInBoolean: boolean = true;
  toAlarmBoolean: boolean = true;
  //

  launched:boolean = false; //Ready btn Clicked
  cameraTurnedOnFromChild: boolean = false; //Camera turned on(allowed)
  firstDetected: boolean = false; //first detection
  faceCompleted: boolean = false; //oneFace found
  continueDetect: any; //variable to assign setInterval function
  photoUrlSaved:boolean = false;//has Base64saved?
  photoUrl: string = ''; //in case of aws
  base64: string = '';
  proceedToSignUpBoolean: boolean =false;
  errorMsg: string = '';

  progress: boolean = true; // Nothing to do with logic. progress bar for user

  // testBoolean: boolean = true;

  now: number = Date.now();
  selectedAudio: string = '';


  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(NAME_REGEX),
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(20)
  ]);

  constructor(
    public snackBar: MdSnackBar,
    private userService: UserService,
    private router: Router) {
    if(!this.currentUser){
      console.log("yes");
    }
  }

  ngOnInit() {
    this.userService.checklogin()
    .then((currentUserFromApi) => {
      this.currentUser = currentUserFromApi;
      this.loggedIn=true;
    } )

    setInterval(()=>{
      this.now = Date.now();
    },500)
  }

  ngDoCheck() {

    if(this.launched && !this.cameraComponent){
      this.showMesseges();
    }

    if(!this.cameraTurnedOnFromChild && //Check if camera is turned on for the first time
       this.cameraComponent &&          //make sure the cameraCom is not undefined
       this.cameraComponent.launched){  //did camera succeed?

      this.cameraTurnedOnFromChild = true;
      setTimeout(()=>{
        this.progress = false;
        $('.firstLine').html('Camera ready. Looking for your face...');
      },1400);
      setTimeout(()=>{
          this.cameraComponent.visionDetect().then(res=>this.firstDetected = true);
      },4200);
    } //First visionDetect done

    if(this.firstDetected && !this.faceCompleted && this.cameraComponent.detected ){
      console.log("condition running..");
      let continueIt = true;

      if(!this.cameraComponent.faceAnno){
        $('.firstLine').html(`I can't find any faces. Show your face.`);
        let str = `Is that <b>${this.cameraComponent.labelAnno[0].description}</b>? or
                           <b>${this.cameraComponent.labelAnno[1].description}</b>? `;
        if(this.cameraComponent.labelAnno[2]){
          str = str + `<b>${this.cameraComponent.labelAnno[2].description}</b>? `;
        }
        str = str + `Now, try again.`;
        $('.secondLine').html(str);
        $('.secondLine').removeClass('_hidden');
      }
      else if(this.cameraComponent.faceCount!==1){
        $('.firstLine').html(`I see more than one face.
                              <b>${this.cameraComponent.faceCount}</b> faces?`);
        $('.secondLine').html(`Just show your face. Now, try again`);
        $('.secondLine').removeClass('_hidden');
      }
      else if(
        this.cameraComponent.faceAnno[0].headwearLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].headwearLikelihood === 'LIKELY'){
          $('.firstLine').html(`Take off your hat please. Now, try again`);
          $('.secondLine').addClass('_hidden');
      }
      else if(
        this.cameraComponent.faceAnno[0].joyLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].joyLikelihood === 'LIKELY'){
          $('.firstLine').html(`😊&nbspI like your smile! You seem <b>happy</b>.`);
          $('.secondLine').addClass('_hidden');
          this.faceCompleted = true;
          clearTimeout(this.continueDetect);
          continueIt = false;
      }
      else if(
        this.cameraComponent.faceAnno[0].angerLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].angerLikelihood === 'LIKELY'){
          $('.firstLine').html(`😡&nbspYou seem <b>upset</b>. Eat a cookie.🍪`);
          $('.secondLine').addClass('_hidden');
          this.faceCompleted = true;
          clearTimeout(this.continueDetect);
          continueIt = false;
      }
      else if(
        this.cameraComponent.faceAnno[0].sorrowLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].sorrowLikelihood === 'LIKELY'){
          $('.firstLine').html(`😔&nbspYou seem <b>sad</b>. What happened?`);
          $('.secondLine').addClass('_hidden');
          this.faceCompleted = true;
          clearTimeout(this.continueDetect);
          continueIt = false;
      }
      else if(
        this.cameraComponent.faceAnno[0].surpriseLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].surpriseLikelihood === 'LIKELY'){
          $('.firstLine').html(`😮&nbspAre you <b>surprised</b>?`);
          $('.secondLine').addClass('_hidden');
          this.faceCompleted = true;
          clearTimeout(this.continueDetect);
          continueIt = false;
      }
      else{
          $('.firstLine').html(`😑&nbspI can't tell your emotion. But Whatever.`);
          $('.secondLine').addClass('_hidden');
          this.faceCompleted = true;
          clearTimeout(this.continueDetect);
          continueIt = false;
      }

      if(continueIt){  //Continue if face was not detected
        this.continueDetect = this.continueDetecting();
      }

    }

    if(this.faceCompleted && !this.photoUrlSaved){
      this.base64= this.cameraComponent.base64;
      this.cameraComponent.captureIt();
      clearTimeout(this.continueDetect);
      $('.buttonCol').removeClass('_hidden');
      console.log("yep! Face detected!");
      this.photoUrlSaved = true;
      $('.okButton').click(()=>{
        this.proceedToSignUp();
        this.cameraComponent.minimizeIt();
      });
    }


  }//end of ngDoCheck



  continueDetecting(){
    return setTimeout(()=>{
      this.cameraComponent.visionDetect();
    }, 4000);
  }

  readyClick(){
    this.launched = true;
  }

  showMesseges(){
    // this.snackBar.open(message ,done? "okay": null ,{
    //   extraClasses: ['snackBar'] //Why Dosn't this work
    // });
    this.snackBar.openFromComponent(MsgSnackComponent, {
      extraClasses: ['snackBar']// $('.snackBar').css('background-color','#26323');
    });
    // This can't be dynamic even with a service. cuz Material loads its html
    // and save to snackBar component - use jQuery
  }

  proceedToSignUp(){
    console.log("proceedToSignUp");
    this.proceedToSignUpBoolean = true;
    $('.cameraTopPadding').css('margin-top','9vh');
    $('.firstLine').html(`📝&nbspPlease Sign Up!`);
    $('.okButton').off('click').click(()=>{
      this.snackBar.dismiss();
    });
  }

  signAndLogToggle(){
    this.toSignInBoolean = this.toSignInBoolean ? false : true;
    this.nameInput = '';
    this.passwordInput = '';
    this.nameFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(NAME_REGEX),
      Validators.minLength(3),
      Validators.maxLength(20)
    ]);

    this.passwordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]);
  }

  signUp(){
    this.userService.signup(this.nameInput, this.passwordInput)
    .then((resultFromApi) => {
        // clear form
        this.nameInput = "";
        this.passwordInput = "";
        this.errorMsg = "";

        // this.router.navigate(['/home']);
        this.loggedIn = true; // to view logged in views
        this.cameraComponent.hideCapture(); // to hide captured img
    })
    .catch((err) => {
        const parsedError = err.json();
        this.errorMsg = parsedError.message;
    });
  }

  logIn(){
    this.userService.login(this.nameInput, this.passwordInput)
      .then((resultFromApi) => {
          // clear the form
          this.nameInput = "";
          this.passwordInput = "";

          // clear the error message
          this.errorMsg = "";

          // redirect to /camels
          // this.router.navigate(['/home']);
          this.loggedIn = true;
      })
      .catch((err) => {
          const parsedError = err.json();
          this.errorMsg = parsedError.message;
      });
  }

  logOut(){
    this.userService.logout()
    .then(()=>{
      this.loggedIn = false;
      this.router.navigate(['/']);
    })
    .catch(()=>{
    });
  }

  /********** sign up & log in done **********/




}
