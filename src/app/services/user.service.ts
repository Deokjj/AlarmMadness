import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

  constructor(
    private http: Http
  ) { }


  //signs up and logs in
  // an argument for each "req.body" in the API route
  signup(name, password, file) {
      return this.http
        .post(
          'http://localhost:3000/api/signup',
          // 'https://alarmmadness.herokuapp.com/api/signup',

          // Form body information to send to the back end (req.body)
          {
            name: name,
            password: password,
            file: file  //req.file on auth.js on server
          },

          // Send the cookies across domains
          { withCredentials: true }
        )

        // Convert from observable to promise
        .toPromise()

        // Parse the JSON
        .then(res => res.json());
  } // close signup()


  login( name,password ) {
      return this.http
        .post(
          'http://localhost:3000/api/login',
          // 'https://alarmmadness.herokuapp.com/api/login',

          // Form body information to send to the back end (req.body)
          {
            name: name,
            password : password
          },

          // Send the cookies across domains
          { withCredentials: true }
        )

        // Convert from observable to promise
        .toPromise()

        // Parse the JSON
        .then(res => res.json());
  } // close login()


  logout() {
      return this.http
        .post(
          'http://localhost:3000/api/logout',
          // 'https://alarmmadness.herokuapp.com/api/logout',

          // Nothing to send to the back end (req.body)
          {},

          // Send the cookies across domains
          { withCredentials: true }
        )

        // Convert from observable to promise
        .toPromise()

        // Parse the JSON
        .then(res => res.json());
  } // close logout()


  checklogin() {
      return this.http
        .get(
          'http://localhost:3000/api/checklogin',
          // 'https://alarmmadness.herokuapp.com/api/checklogin',

          // Send the cookies across domains
          { withCredentials: true }
        )

        // Convert from observable to promise
        .toPromise()

        // Parse the JSON
        .then(res => res.json());
  } // close checklogin()

  newAlarm(id,timeSet, alarmCreatedAt, soundSet){
    return this.http
     .patch(
       'http://localhost:3000/api/newalarm',
      //  'https://alarmmadness.herokuapp.com/api/newalarm',
       {
         id: id,
         timeSet: timeSet,
         alarmCreatedAt: alarmCreatedAt,
         soundSet: soundSet
       },
       { withCredentials: true }
     )
     .toPromise()
     .then(res => res.json());
  }

}
