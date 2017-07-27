import * as jQuery from 'jquery';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BackgroundComponent } from '../../background/background.component';
import { CameraComponent } from '../../camera/camera.component';
import { MdSnackBar } from '@angular/material';
import { MsgSnackComponent } from '../../signuplogin/signup/msg-snack/msg-snack.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(BackgroundComponent) backgroundComponent: BackgroundComponent;

  constructor() { }

  ngOnInit() {
  }

}
