import * as jQuery from 'jquery';
import * as moment from 'moment';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraComponent } from '../../camera/camera.component';
import { BackgroundComponent } from '../../background/background.component';
import { MdSnackBar, MdSidenavContainer } from '@angular/material';
import { MsgSnackComponent } from './msg-snack/msg-snack.component';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { YoutubeSearchComponent } from './youtube-search/youtube-search.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DiceComponent } from './dice/dice.component';
// import { AwsService } from '../../services/aws.service';


const NAME_REGEX = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
const NUMBERONLY = /^\d+$/;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss',
              './addIt.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(CameraComponent) cameraComponent: CameraComponent;
  @ViewChild(BackgroundComponent) background : BackgroundComponent;
  @ViewChild(MdSidenavContainer) navContainer: MdSidenavContainer;
  @ViewChild(YoutubeSearchComponent) youtubeDialog: YoutubeSearchComponent;
  @ViewChild(DiceComponent) diceComponent: DiceComponent;

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
  showYtVideo: boolean = false;
  ytVideoPlayed: boolean  = false;
  //

  launched:boolean = false; //Ready btn Clicked
  cameraOn : boolean = false;
  isDetectionDone: boolean  =false;
  cameraTurnedOnFromChild: boolean = false; //Camera turned on(allowed)
  firstDetected: boolean = false; //first detection
  faceCompleted: boolean = false; //oneFace found
  continueDetect: any; //variable to assign setInterval function
  faceCompletionConfirmed:boolean = false;//has Base64saved?
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
  alarmTimeToDisplay =[];


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
    {value: 'RbiEESkyaeM', viewValue: 'Morning Alarm'},
    {value: 'QH2-TGUlwu4', viewValue: 'Nyan Cat'},
    {value: '-', viewValue: 'Search Youtube'}
  ];
  title: string = '';


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

    player: YT.Player;
    ytId: string = 'QH2-TGUlwu4'; //Nyan Cat
    // 'RbiEESkyaeM'; // Good Morning
    // '-HXySf-Fa3U'; // Freakum

  constructor(
    public snackBar: MdSnackBar,
    private userService: UserService,
    // private awsService: AwsService,
    // private youtubeService: YoutubeService,
    private router: Router,
    public dialog: MdDialog) {
    if(!this.currentUser){
      console.log("no User");
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
    })

    this.refreshAlarm()
    .then((res)=>{
      console.log('page refreshed.');
      console.log('alarmTimeToDisplay: ', this.alarmTimeToDisplay);
      console.log('hasAlarm: ', this.hasAlarm);
      console.log('this.set: ', this.set);
    });

  }

  ngDoCheck() {

    // if(this.launched && !this.cameraComponent){
    //   // this.showMesseges();
    // }

    if(!this.cameraTurnedOnFromChild && //Check if camera is turned on for the first time
       this.cameraComponent &&          //make sure the cameraCom is not undefined
       this.cameraComponent.launched){  //did camera succeed?

      this.cameraTurnedOnFromChild = true;
      setTimeout(()=>{
        this.progress = false;
        if(!this.expressionTask){
          $('.firstLine').html('Camera ready. Looking for your face...');
        }
        else{
          this.instructExpress();
        }
      },1400);
      setTimeout(()=>{
          this.cameraComponent.visionDetect()
          .then(res=>{
            this.firstDetected = true
            this.base64= this.cameraComponent.base64;
          })
          .then(res => this.isDetectionDone = true);
      },3500);
    } //First visionDetect done

    if(this.firstDetected && !this.faceCompleted && this.cameraComponent.detected && this.isDetectionDone ){
      console.log("condition running..");
      let continueIt = false;
      this.isDetectionDone = false;

      if(!this.cameraComponent.faceAnno){
        $('.firstLine').html(`I can't find any faces. Show your face.`);
        let str = `Is that <b>${this.cameraComponent.labelAnno[0].description}</b>? or
                           <b>${this.cameraComponent.labelAnno[1].description}</b>? `;
        if(this.cameraComponent.labelAnno[2]){
          str = str + `<b>${this.cameraComponent.labelAnno[2].description}</b>? `;
        }
        str = str + `Now, try again.`;
        str = this.expressionTask ? str + ` ${this.expressionSubString}!` : str;

        $('.secondLine').html(str);
        $('.secondLine').removeClass('_hidden');
        continueIt = true;
      }
      else if(this.cameraComponent.faceCount!==1){
        $('.firstLine').html(`I see more than one face.
                              <b>${this.cameraComponent.faceCount}</b> faces?`);
        let str = `Just show your face. Now, try again.`;
        str = this.expressionTask ? str + ` ${this.expressionSubString}!` : str;
        $('.secondLine').html(str);
        $('.secondLine').removeClass('_hidden');
        continueIt = true;
      }
      else if(
        this.cameraComponent.faceAnno[0].headwearLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].headwearLikelihood === 'LIKELY'){
          let str = `Take off your hat please. Now, try again.`;
          str = this.expressionTask ? str + ` ${this.expressionSubString}!` : str;
          $('.firstLine').html(str);
          $('.secondLine').addClass('_hidden');
          continueIt = true;
      }
      else if(
        this.cameraComponent.faceAnno[0].joyLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].joyLikelihood === 'LIKELY'){
          $('.firstLine').html(`😊&nbspI like your smile! You seem <b>happy</b>.`);

          //when signUp
          if(!this.expressionTask){
            $('.secondLine').addClass('_hidden');
            this.faceCompleted = true;
            clearTimeout(this.continueDetect);
          }
          //when unlocking & matched expression
          else if(this.expressionTask === 'smile'){
            this.expressionMatched();
          }
          else{
            this.wrongExpression('smiling 😊');
            continueIt = true;
          }
      }
      else if(
        this.cameraComponent.faceAnno[0].angerLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].angerLikelihood === 'LIKELY' ||
        this.cameraComponent.faceAnno[0].angerLikelihood === 'POSSIBLE'){
          $('.firstLine').html(`😡&nbspYou seem <b>upset</b>. Eat a cookie.🍪`);

          if(!this.expressionTask){
            $('.secondLine').addClass('_hidden');
            this.faceCompleted = true;
            clearTimeout(this.continueDetect);
          }
          else if(this.expressionTask === 'anger'){
            this.expressionMatched();
          }
          else{
            this.wrongExpression('making angry face 😡');
            continueIt = true;
          }
      }
      else if(
        this.cameraComponent.faceAnno[0].sorrowLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].sorrowLikelihood === 'LIKELY'){
          $('.firstLine').html(`😔&nbspYou seem <b>sad</b>. What happened?`);

          if(!this.expressionTask){
            $('.secondLine').addClass('_hidden');
            this.faceCompleted = true;
            clearTimeout(this.continueDetect);
          }
          else if(this.expressionTask === 'sad'){
            this.expressionMatched();
          }
          else{
            this.wrongExpression('making sad face 😔');
            continueIt = true;
          }

      }
      else if(
        this.cameraComponent.faceAnno[0].surpriseLikelihood === 'VERY_LIKELY' ||
        this.cameraComponent.faceAnno[0].surpriseLikelihood === 'LIKELY'){
          $('.firstLine').html(`😮&nbspAre you <b>surprised</b>?`);

          if(!this.expressionTask){
            $('.secondLine').addClass('_hidden');
            this.faceCompleted = true;
            clearTimeout(this.continueDetect);
          }
          else if(this.expressionTask === 'surprised'){
            this.expressionMatched();
          }
          else{
            this.wrongExpression('making surprised face 😮');
            continueIt = true;
          }
      }
      else{
          if(!this.expressionTask){
            $('.firstLine').html(`😑&nbspI can't tell your emotion. But Whatever.`);
            $('.secondLine').addClass('_hidden');
            this.faceCompleted = true;
            clearTimeout(this.continueDetect);
          }
          else{
            $('.firstLine').html(`😑&nbspI can't tell your emotion.`);
            $('.secondLine').html(`Please ${this.expressionSubString}!`).removeClass('_hidden');
            continueIt = true;
          }
      }

      if(continueIt){  //Continue if face was not detected
        this.continueDetect = this.continueDetecting();
      }

    }

    if(this.faceCompleted && !this.faceCompletionConfirmed){
      this.faceCompletionConfirmed = true;
      this.cameraComponent.captureIt();
      clearTimeout(this.continueDetect);
      console.log("yep! Face detected!");
      $('.buttonCol').removeClass('_hidden');
      $('.okButton').click(()=>{
        this.proceedToSignUp();
        this.cameraComponent.minimizeIt();
        this.cameraComponent.clearCanvas();
      });
    }

    if(this.loggedIn && this.toAlarmBoolean &&
      !($('.mat-input-infix').css('padding') === "15px 0px") ){
      $('.mat-input-infix').css('padding','15px 0');
      $('.mat-disabled').removeClass('mat-disabled');
    }

    if(this.hasAlarm && !this.ringingViewBoolean){
      if(this.set.isSameOrBefore(this.now)){
        this.ringIt();
      }
    }

    if(this.player &&
      this.ytVideoPlayed &&
      (this.player.getPlayerState() ===0 ||
      this.player.getPlayerState() === 2 ) ){

      this.player.playVideo();

    }

    if(this.searchDialog && this.searchDialog.componentInstance.items){
      if(this.searchDialog.componentInstance.items[2] ||
        this.searchDialog.componentInstance.player){
        this.searchDialog.updateSize('height', '90%');
      }
      else{
        this.searchDialog.updateSize('height', 'auto');
      }
    }

    if(this.diceComponent && this.diceComponent.rolling && !this.diceComponent.clickOff){
      this.roll();
      this.diceComponent.hideIntro();
      this.diceComponent.turnOffClick();
    }

    if(this.diceComponent && this.diceComponent.emoji && !this.diceComponent.rolling){
      this.setUpExpression(this.diceComponent.emoji);
      this.diceComponent.emoji = '';
    }

  }//end of ngDoCheck



  continueDetecting(){
    return setTimeout(()=>{
      this.cameraComponent.clearCanvas();
      this.cameraComponent.visionDetect().then(()=>{
        this.isDetectionDone = true;
        this.base64= this.cameraComponent.base64;
      });
    }, 2500);
  }

  readyClick(){
    this.launched = true;
    this.cameraOn = true;
    this.showMesseges();
  }

  showMesseges(){

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

    this.userService.signup(this.nameInput, this.passwordInput, undefined)
    .then((resultFromApi) => {
        // clear form
        this.nameInput = "";
        this.passwordInput = "";
        this.errorMsg = "";

        // this.router.navigate(['/home']);
        this.loggedIn = true; // to view logged in views
        this.currentUser = resultFromApi;
        // this.cameraComponent.hideCapture(); // to hide captured img

        this.cameraOn = false;
        this.cameraComponent = undefined;
        this.snackBar.dismiss();
        this.cameraTurnedOnFromChild = false;
        this.isDetectionDone = false;
        this.firstDetected = false;
        this.faceCompleted = false;
        this.proceedToSignUpBoolean = false;
        this.faceCompletionConfirmed = false;
        this.launched = false;
        this.progress = true;

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
          this.loggedIn = true;

          this.refreshAlarm()
          .then((res)=>{
            console.log('just logged In, alarm array of current user is: ', this.alarmTimeToDisplay);
            console.log('hasAlarm: ', this.hasAlarm);
            console.log('soonest Alarm: ', this.set);
          });
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

  //method to toggle between alarm and timer
  isAlarmCheckedToggle(){
    this.isAlarmChecked = this.isAlarmChecked ? false : true;
    this.isAlarmChecked ?
      $('.alarmIcon').addClass('pinkIt'): $('.alarmIcon').removeClass('pinkIt');
    this.isAlarmChecked ?
      $('.timerIcon').removeClass('pinkIt'): $('.timerIcon').addClass('pinkIt');
    $('.mat-disabled').removeClass('mat-disabled');

    //Different validator form for alarm or timer
    if(this.isAlarmChecked){
      this.hoursFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(NUMBERONLY),
        Validators.min(1),
        Validators.max(12)
      ]);
    }
    else{
      this.hoursFormControl = new FormControl('',[
        Validators.required,
        Validators.pattern(NUMBERONLY),
        Validators.min(0),
        Validators.max(24)
      ]);
    }
  }

  //method to toggle between PM and AM
  amPmToggle(){
    this.isPM = this.isPM ? false : true;
    this.isPM ? $('.amBtn').html('PM') : $('.amBtn').html('AM');
  }


  audioSelect(val){
    if(val === this.sounds[0].value){
      this.title = "Morning";
    }
    else if(val === this.sounds[1].value){
      this.title = "Nyan Cat"
    }
  }

  searchDialog: MdDialogRef<YoutubeSearchComponent>;
  //Only when 'Youtube Search' is selected
  openSearchDialog(){
    this.searchDialog = this.dialog.open(YoutubeSearchComponent,{
      height: 'auto',
      width: '1000px'
    });

    this.searchDialog.afterClosed().subscribe(result => {
      this.sounds[2].value = this.searchDialog.componentInstance.selectedId;
      this.selectedAudio = this.searchDialog.componentInstance.selectedId;
      this.title = this.searchDialog.componentInstance.titleOfSelected;
      this.searchDialog = undefined; // clean up dialog ref.
    });
  }

  createAlarm(){
    //create alarm
    if(this.isAlarmChecked){
      //validate Am or PM and convert to 24 hour system
      let amPmString = this.isPM ? "PM" : "AM";
      // let hourInput = this.hoursInput
      let timeString = `${this.hoursInput}:${this.minsInput}:${this.secsInput} ${amPmString}`;

      let alarmSet = moment(timeString, ["h:mm:ss A"]);
      if( alarmSet.isSameOrBefore(moment()) ){
        alarmSet.add(1,'days');
      } //the alarm Time set.

      this.userService.newAlarm
      (this.currentUser._id,alarmSet.format('ddd MMM DD Y hh:mm:ss A zZZ'),moment().toString(),this.selectedAudio,this.title)
      .then((res)=>{
          this.refreshAlarm()
          .then((res)=>{
            console.log("newAlarm set is :", alarmSet);
            console.log("hasAlarm: ", this.hasAlarm);
            console.log("soonest set is: ", this.set);
          });
      });
    }
    //create timer
    else{
      let alarmSet = moment().add(this.hoursInput, 'hours')
                             .add(this.minsInput, 'minutes')
                             .add(this.secsInput, 'seconds');
      this.userService.newAlarm
      (this.currentUser._id,alarmSet.format('ddd MMM DD Y hh:mm:ss A zZZ'),moment().toString(),this.selectedAudio,this.title)
      .then((res)=>{
          this.refreshAlarm()
          .then((res)=>{
            console.log("newAlarm set is :", alarmSet);
            console.log("hasAlarm: ", this.hasAlarm);
            console.log("soonest set is: ", this.set);
          });
      });
    }
    this.hoursInput = undefined;
    this.minsInput = undefined;
    this.secsInput = undefined;
    this.selectedAudio = undefined;
    this.sounds[2].value = '-';
    this.title = "";
    console.log(this.title);
    console.log(this.sounds);
  }

  insertionSort(items) {
    //compare items.timeSet

    var len     = items.length,  // number of items in the array
        value,                   // the value currently being compared
        i,                       // index into unsorted section
        j;                       // index into sorted section

    for (i=0; i < len; i++) {

        // store the current value because it may shift later
        value = items[i];

        /*
         * Whenever the value in the sorted section is greater than the value
         * in the unsorted section, shift all items in the sorted section over
         * by one. This creates space in which to insert the value.
         */
        for (j=i-1; j > -1 && moment(items[j].timeSet).isAfter(value.timeSet); j--) {
            items[j+1] = items[j];
        }

        items[j+1] = value;
    }

    return items;
}

  refreshAlarm(){
    return this.userService.checklogin()
    .then((currentUserFromApi) => {
      this.currentUser = currentUserFromApi;
      this.alarmTimeToDisplay = currentUserFromApi.currentAlarm;
    })
    .then((res)=>{
      if(this.alarmTimeToDisplay[0]){
        this.alarmTimeToDisplay = this.insertionSort(this.alarmTimeToDisplay);
      }
    })///This working !! uncomment it
    .then((res)=>{
      if(this.alarmTimeToDisplay[0]){
        this.set = moment(this.alarmTimeToDisplay[0].timeSet);
        this.ytId = this.alarmTimeToDisplay[0].soundSet.id;
        this.hasAlarm = true;
      }
    });
  }

  deleteAlarm(alarmArrayIndex){
    console.log('hello, index is: ', alarmArrayIndex);
    console.log('time of alarm at i is: ', this.alarmTimeToDisplay[alarmArrayIndex].timeSet);

    return this.userService.deleteAlarm
    (this.currentUser._id, this.alarmTimeToDisplay[alarmArrayIndex].timeSet)
    .then((res)=>{
      this.refreshAlarm()
      .then((res)=>{
        if(!this.alarmTimeToDisplay[0]){
          this.hasAlarm = false;
          this.set = undefined;
        }
        console.log('hasAlarm after deletion: ', this.hasAlarm );
        console.log('timeSet after deletion: ', this.set);
      })
    });
  }


  savePlayer (player) {
    this.player = player;
    console.log('player instance', player)
  }
  onStateChange(event){
    console.log('player state', event.data);
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  ringIt(){
    this.background.switchBackground();
    this.ringingViewBoolean = true;
    this.showYtVideo = true;
    this.set = undefined;
    $('.ytOverlap').addClass('removeAllEvents');
    setTimeout(()=>{
      this.playVideo();
      this.ytVideoPlayed = true;
    },2000);
  }
  unlocking: boolean = false;
  dice: boolean = false;
  expressionTask: string = '';
  expressionSubString: string = '';

  showDice(){
    this.dice = true;
    this.showMesseges();
    $('.firstLine').html('Click and Roll The Dice');
    $('.secondLine').html('To determine the face for you to make to turn the alarm off.');
    $('.secondLine').removeClass('_hidden');
  }

  roll(){
    $('.secondLine').addClass('_hidden');
    $('.firstLine').html('🎲🎲🎲🎲🎲  Rolling...  🎲🎲🎲🎲🎲');
  }

  setUpExpression( emoji:string ){
    if(emoji === 'joy'){
      this.expressionTask = 'smile';
      this.expressionSubString = '<strong>Smile</strong> 😄';
    }
    else if (emoji === 'sad'){
      this.expressionTask = 'sad';
      this.expressionSubString = 'Make <strong>Sad Face</strong> 😔';
    }
    else{
      this.expressionTask = 'surprised';
      this.expressionSubString = 'Make <strong>Surprised Face</strong> 😲';
    }
    $('snack-bar-container').css('max-width', 'none').css('min-width', 'none');
    $('.firstLine').html(`Looks Like You Must
      ${this.expressionSubString} To Turn Alarm Off!`);
    $('.secondLine').html('Are you ready?').removeClass('_hidden');

    $('.buttonCol').removeClass('_hidden');
    $('.okButton > .mat-button-wrapper').html('YES!');
    $('.okButton').off('click').click(()=>{
      this.proceedToUnlock();
      this.dice = false;
    });
  }

  proceedToUnlock(){
    this.unlocking = true;
    this.cameraOn = true;
    this.launched = true;
    $('.buttonCol').addClass('_hidden');
    $('.okButton > .mat-button-wrapper').html('Ok!');
    $('.firstLine').html('Preparing Camera... Please allow camera on this app');
    $('.secondLine').html('').addClass('_hidden');
  }

  instructExpress(){
    $('.firstLine').html(`Camera Ready. Please ${this.expressionSubString}!`);
  }

  wrongExpression( current: string ){
    $('.firstLine').html(`you are ${current}. Now, try again`);
    $('.secondLine').html(`Please ${this.expressionSubString}!`);
    $('.secondLine').removeClass('_hidden');
  }

  expressionMatched(){
    $('.secondLine').html(`Your face expression matched! Now, You can turn alarm off`);
    $('.secondLine').removeClass('_hidden');
    this.faceCompleted = true;
    clearTimeout(this.continueDetect);
    $('.okButton > .mat-button-wrapper').html('OFF!');
    $('.buttonCol').addClass('remove');
    $('.okButton').off('click').click(()=>{
      this.unlock();
    });
  }

  unlock(){
    this.userService.deleteAlarm
    (this.currentUser._id,this.alarmTimeToDisplay[0].timeSet)
    .then((res)=>{
      this.expressionTask = '';
      this.expressionSubString = '';
      this.refreshAlarm()
      .then((res)=>{
        if(!this.alarmTimeToDisplay[0]){
          this.hasAlarm = false;
          this.set = undefined;
          console.log("there isn't more alarm! hasalarm: ", this.hasAlarm);
        }
        this.unlocking = false;
        this.cameraOn = false;
        this.cameraComponent = undefined;
        this.background.switchBackground();
        this.ringingViewBoolean = false;
        this.showYtVideo = false;
        this.ytVideoPlayed = false;
        this.cameraTurnedOnFromChild = false;
        this.isDetectionDone = false;
        this.firstDetected = false;
        this.faceCompleted = false;
        this.faceCompletionConfirmed = false;
        this.launched = false;
        this.progress = true;
        this.snackBar.dismiss();
        $('.ytOverlap').removeClass('removeAllEvents');

      })
    });

  }


}
