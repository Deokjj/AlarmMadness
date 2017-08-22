import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  constructor(
    private http: Http
  ) { }


  //signs up and logs in
  // an argument for each "req.body" in the API route
  signup(name, password, photoUrl) {
      return this.http
        .post(
          // 'http://localhost:3000/api/signup',
          environment.apiBase + '/api/signup',

          // Form body information to send to the back end (req.body)
          {
            name: name,
            password: password,
            photoUrl: photoUrl
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
          // 'http://localhost:3000/api/login',
          environment.apiBase + '/api/login',

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
          // 'http://localhost:3000/api/logout',
          environment.apiBase + '/api/logout',

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
          // 'http://localhost:3000/api/checklogin',
          environment.apiBase + '/api/checklogin',

          // Send the cookies across domains
          { withCredentials: true }
        )

        // Convert from observable to promise
        .toPromise()

        // Parse the JSON
        .then(res => res.json());
  } // close checklogin()

  newAlarm(id,timeSet, alarmCreatedAt, soundSet, title){
    return this.http
     .patch(
      //  'http://localhost:3000/api/newalarm',
       environment.apiBase + '/api/newalarm',
       {
         id: id,
         timeSet: timeSet,
         alarmCreatedAt: alarmCreatedAt,
         soundSet: soundSet,
         title: title
       },
       { withCredentials: true }
     )
     .toPromise()
     .then(res => res.json());
  }

  deleteAlarm(id,timeSet){
    return this.http
     .patch(
       environment.apiBase +'/api/deleteAlarm',
       {
         id: id,
         timeSet: timeSet  //alarm with the same timeSet to be deleted
       },
       { withCredentials: true }
     )
     .toPromise()
     .then(res=> res.json());
  }

}
