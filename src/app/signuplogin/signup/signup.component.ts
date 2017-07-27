import * as jQuery from 'jquery';
import * as moment from 'moment';
// import * as fs from 'fs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraComponent } from '../../camera/camera.component';
import { BackgroundComponent } from '../../background/background.component';
import { MdSnackBar, MdSidenavContainer } from '@angular/material';
import { MsgSnackComponent } from './msg-snack/msg-snack.component';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
// import { AwsService } from '../../services/aws.service';

// import { SnackServiceService } from './msg-snack/snack-service.service';

const NAME_REGEX = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
const NUMBERONLY = /^\d+$/;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild(CameraComponent) cameraComponent: CameraComponent;
  @ViewChild(BackgroundComponent) background : BackgroundComponent;
  @ViewChild(MdSidenavContainer) navContainer: MdSidenavContainer;

  // input initializing
  nameInput: string;
  passwordInput : string;
  //

  // Page view conditions
  currentUser: any = {};
  loggedIn: boolean = false;
  toSignInBoolean: boolean = true;
  toAlarmBoolean: boolean = true;
  toFeedBoolean: boolean = false;
  ringingViewBoolean: boolean =false;
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

  uploader = new FileUploader({
    url: 'http://localhost:3000/api/signup'
  });
  // testBoolean: boolean = true;

  // now: number = Date.now();
  now: number;

  //Alarm Form
  isAlarmChecked: boolean = true; // true if alarm false if timer
  selectedAudio: string = ''; // morning, beeping, youtube
  isPM: boolean = false; // true if PM false if AM
  hoursInput: number;
  minsInput: number;
  secsInput: number;

  alarm: any = {};
  hasAlarm: boolean = false;
  set: any;


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

  sounds = [
    {value: 'morning', viewValue: 'Morning Alarm'},
    {value: 'beeping', viewValue: 'Beeping Sound'},
    {value: 'youtube', viewValue: 'Youtube'}
  ];


    hoursFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(NUMBERONLY),
      Validators.min(1),
      Validators.max(12)
    ]);
    minsFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(NUMBERONLY),
      Validators.min(0),
      Validators.max(60)
    ]);
    secsFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(NUMBERONLY),
      Validators.min(0),
      Validators.max(60)
    ]);

  constructor(
    public snackBar: MdSnackBar,
    private userService: UserService,
    // private awsService: AwsService,
    private router: Router) {
    if(!this.currentUser){
      console.log("yes");
    }
    this.now = Date.now();
    setInterval(()=>{
      this.now = Date.now();
    },500)
  }

  ngOnInit() {
    this.userService.checklogin()
    .then((currentUserFromApi) => {
      this.currentUser = currentUserFromApi;
      this.loggedIn=true;
    } )
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

    if(this.loggedIn && this.toAlarmBoolean &&
      !($('.mat-input-infix').css('padding') === "15px 0px") ){
      $('.mat-input-infix').css('padding','15px 0');
      $('.mat-disabled').removeClass('mat-disabled');
    }

    if(this.hasAlarm){
      if(this.set.isSameOrBefore(this.now)){
        this.set = undefined;
        this.alarm = {};
        this.hasAlarm = false;
        this.background.switchBackground();
        this.ringingViewBoolean = true;
      }
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

    // this.imgUpload.onSuccessItem = (item, response) => {
    //   return;
    // }
    // this.imgUpload.onErrorItem = (item, response) => {
    //   this.message = "Oops something went wrong :(";
    //   return;
    // }
    // this.imgUpload.onBuildItemForm = (item, formToBeSent) => {
    //   for (let fieldName in form.value) {
    //     formToBeSent.append(fieldName, form.value[fieldName]);
    //   }
    //
    // }

    // this.imgUpload.uploadAll();

    this.userService.signup(this.nameInput, this.passwordInput, undefined)
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

  sidenavOpen(){
    // console.log('yeees');
    this.navContainer.open();
    $('.side-container').click(()=>{
      // console.log('hey!!');
    })
  }

  viewAlarm(){
    this.toFeedBoolean = false;
    this.toAlarmBoolean = true;
    this.navContainer.close();
  }
  viewFeed(){
    this.toFeedBoolean = true;
    this.toAlarmBoolean = false;
    this.navContainer.close();
  }

  isAlarmCheckedToggle(){
    this.isAlarmChecked = this.isAlarmChecked ? false : true;
    this.isAlarmChecked ?
      $('.alarmIcon').addClass('pinkIt'): $('.alarmIcon').removeClass('pinkIt');
    this.isAlarmChecked ?
      $('.timerIcon').removeClass('pinkIt'): $('.timerIcon').addClass('pinkIt');
    $('.mat-disabled').removeClass('mat-disabled');
  }

  amPmToggle(){
    this.isPM = this.isPM ? false : true;
    this.isPM ? $('.amBtn').html('PM') : $('.amBtn').html('AM');
  }

  createAlarm(){
    let amPmString = this.isPM ? "PM" : "AM";
    let timeString = `${this.hoursInput}:${this.minsInput}:${this.secsInput} ${amPmString}`;

    let alarmSet = moment(timeString, ["h:mm:ss A"]);
    if( alarmSet.isSameOrBefore(moment()) ){
      alarmSet.add(1,'days');
    } //the alarm Time set.
    console.log(alarmSet);
    console.log(this.selectedAudio);
    this.alarm = {
      createdAt : new Date(),
      set: alarmSet.toDate(),
      selectedAudio: this.selectedAudio
    }
    this.hasAlarm = true;
    this.set = alarmSet;
  }



}
