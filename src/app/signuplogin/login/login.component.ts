import * as jQuery from 'jquery';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

const NAME_REGEX = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  nameInput : string = '';
  passwordInput : string = '';
  errormsg: string = '';

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
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logIn(){
    this.userService.login(this.nameInput, this.passwordInput)
      .then((resultFromApi) => {
          // clear the form
          this.nameInput = "";
          this.passwordInput = "";

          // clear the error message
          this.errormsg = "";

          // redirect to /camels
          this.router.navigate(['/home']);
      })
      .catch((err) => {
          const parsedError = err.json();
          this.errormsg = parsedError.message;
      });
  }
}
