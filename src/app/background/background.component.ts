import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  isDay: boolean = false;

  constructor() {
  }

  ngOnInit() {

  }

  switchBackground(){
    if(this.isDay){
      $('.toggle').prop('checked', false);
      this.isDay = false;
    }
    else{
      $('.toggle').prop('checked', true);
      this.isDay = true;
    }
  }

}
