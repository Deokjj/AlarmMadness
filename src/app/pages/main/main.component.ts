import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// import './clock.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})



export class MainComponent implements OnInit, OnDestroy {
  pmOrAm : string = "";
  updateInterval: any;
  updateAmPm : any;
  currentUser: any = {};


  constructor(public dialog: MdDialog,
              private userService: UserService,
              private router: Router) {
    this.updateAmPm = setInterval(() => {
      var time = new Date();
      var hours = time.getHours();
      this.pmOrAm = hours >= 12 ? 'PM' : 'AM';
    },1000);
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }

  ngOnInit() {
    //check if logged in previous, then route to home page
    this.userService.checklogin()
    .then((res) => {
      this.router.navigate(['/home']);
    }).
    catch((err)=>{
      console.log(err._body);
    });

    var clock = {

    	clocktime: {
        hour: <number> null,
        minute: <number> null,
        second: <number> null
      },

      dots: document.querySelectorAll('#lcd-clock .dots'),

      dotsState: false,

      updateClock: function (){

    		var time = new Date();
        var hours = time.getHours();


        hours = hours % 12;

        hours = hours ? hours : 12; // the hour '0' should be '12'

    		clock.clocktime.hour   = hours;
    		clock.clocktime.minute = time.getMinutes();
    		clock.clocktime.second = time.getSeconds();

    		for (var timeUnit in clock.clocktime) {
    			// convert all to values to string,
    			// pad single values, ie 8 to 08
    	 		// split the values into an array of single characters
    			clock.clocktime[timeUnit] = clock.clocktime[timeUnit].toString();
    			if (clock.clocktime[timeUnit].length == 1) {
    				clock.clocktime[timeUnit] = '0'+clock.clocktime[timeUnit];
    			}
    			clock.clocktime[timeUnit] = clock.clocktime[timeUnit].split('');

    			// update each digit for this time unit
    			for (var i=0; i<2; i++) {
    				var selector = '#lcd-clock .'+timeUnit+'.digit-'+(i+1);
    				var className = 'number-is-'+clock.clocktime[timeUnit][i];
    				// remove any pre-existing classname
    				for (var j=0; j<10; j++) {
    					var oldClass = 'number-is-'+j;
    					document.querySelector(selector).classList.remove(oldClass);
    				}
    				// add the relevant classname to the appropriate clock digit
    				document.querySelector(selector).classList.add(className);
    			}

    		}

    		clock.toggleDots();
    	},

    	toggleDots: function(){

    		var num_dots = clock.dots.length;

    		for (var i=0; i < num_dots; i++) {
    			if (clock.dotsState === false) {
    				clock.dots[i].classList.add('lcd-element-active');
    				continue;
    			} else {
    				clock.dots[i].classList.remove('lcd-element-active');
    			}
    		}

    		clock.dotsState = !clock.dotsState;

    	},

    	init: function(){

    		clock.toggleDots();
    		clock.updateClock();
    		// // update every half second to make dots flash at that rate :)
    	}

    };
    this.pmOrAm = new Date().getHours() >= 12 ? 'PM' : 'AM';
    if(this.pmOrAm){
      $('.pmOrAm').html("PM");
    }
    else{
      $('.pmOrAm').html("AM");
    }

    clock.init();
    this.updateInterval = setInterval(clock.updateClock, 500);
    /* FIX THIS FUNCTION SO IT UPDATES AM AND PM WHEN NEEDED */

  }//ngInIt ends

  ngOnDestroy() {
    clearInterval(this.updateInterval);
    clearInterval(this.updateAmPm);
  }



}
