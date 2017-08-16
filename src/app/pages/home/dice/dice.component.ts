import * as jQuery from 'jquery';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {

  result: string = '';
  emoji: string = '';

  min: number = 1;
  max: number = 24;

  rolling: boolean = false;
  intro: boolean = true;
  clickOff: boolean = false;

  constructor() {
  }

  ngOnInit() {}

  roll(){
    console.log('ROLLING');
    this.rolling = true;
    let xRand = this.random(this.min,this.max);
    let yRand = this.random(this.min,this.max);

    let xRandDeg = xRand * 90;
    let yRandDeg = yRand * 90;

    $('#cube').css('transform' ,'rotateX('+xRandDeg+'deg) rotateY('+yRandDeg+'deg)');
    $('#cube').on('transitionend webkitTransitionEnd oTransitionEnd',()=>{
      $('#cube').off('transitionend webkitTransitionEnd oTransitionEnd');
      this.rolling = false;
      console.log('transition done!');
    })
    this.setResult(xRand,yRand);
  }

  random(min:number, max:number){
    return (Math.floor(Math.random() * (max-min)) + 1);
  }

  setResult(x:number, y:number){
    x = x%4;
    y = y%4;

    let result = 'front';

    // front -> bottom -> back -> top -> front
    // left -> bottom, right -> bottom
    while(x>0){
      --x;
      result = (result === 'front')   ? 'bottom':
               (result === 'bottom')  ? 'back':
               (result === 'back')    ? 'top' :
               (result === 'top')     ? 'front': 'bottom';
    }
    // front -> left -> back -> right -> front
    // bottom -> bottom, top -> top
    while(y>0){
      --y;
      result = (result === 'front')   ? 'left':
               (result === 'left')    ? 'back':
               (result === 'back')    ? 'right' :
               (result === 'right')   ? 'front':
               (result === 'bottom')  ? 'bottom' : 'top';
    }

   console.log('result dice: ',result);
   this.result = result;
   this.setEmotion(result);
  }

  setEmotion(result: string){
    this.emoji = (result === 'front' || result ==='back' ) ? 'joy':
                 (result === 'left'  || result ==='right') ? 'sad':
                 'surprised';
    console.log('result emoji: ', this.emoji);
  }

  turnOffClick(){
    this.clickOff = true;
  }

  hideIntro(){
    this.intro = false;
  }

}
