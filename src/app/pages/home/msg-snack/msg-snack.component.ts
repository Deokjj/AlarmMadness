import { Component, OnInit } from '@angular/core';
// import { SnackServiceService } from './snack-service.service';
// import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-msg-snack',
  templateUrl: './msg-snack.component.html',
  styleUrls: ['./msg-snack.component.scss'],
  // providers: [ SnackServiceService ]
})
export class MsgSnackComponent implements OnInit {

  // constructor( private snackService: SnackServiceService ) {
  //   console.log("3 snack constructed");
  //   console.log("snackService.test$", snackService.test$);
  //   this.subscription = snackService.test$.subscribe(
  //     test =>{
  //       this.test = test;
  //       console.log("4 test subscribed: ",this.test);
  //     }
  //   );
  // }
  constructor(){}

  ngOnInit() {
  }

}
