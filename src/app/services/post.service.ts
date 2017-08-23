import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Injectable()
export class PostService {

  constructor(
    private http: Http
  ) { }

  newPost(postObject: any){
    return this.http
    .post(
      environment.apiBase + '/api/newpost',
      {
        timeSet: postObject.timeSet,
        alarmCreatedAt: postObject.alarmCreatedAt,
        userId: postObject.userId,
        userName: postObject.userName,
        emoji: postObject.emoji,
        photoUrl: postObject.photoUrl,
        soundSet: postObject.soundSet
      },
      { withCredentials: true }
    )
    .toPromise()
    .then(res => res.json());
  }

  loadAllPost(){
    return this.http
    .get(
      environment.apiBase + '/api/loadposts',
      { withCredentials: true }
    )
    .toPromise()
    .then(res => res.json());
  }

  loadByCurrentUser(currentUserId){
    return this.http
    .get(
      environment.apiBase + '/api/loadposts/' + currentUserId,
      { withCredentials: true }
    )
    .toPromise()
    .then(res => res.json());
  }

  deletePost(id){
    return this.http
    .delete(
      environment.apiBase + '/api/deletepost',
      { withCredentials: true,
        body:{
          id: id
        }
      }
    )
    .toPromise()
    .then(res => res.json());
  }


  // body={ userId,userName,photoUrl,comment,postId}
  addComment(body){
    return this.http
    .patch(
      environment.apiBase + '/api/addcomment',
      body,
      { withCredentials: true }
    )
    .toPromise()
    .then(res=>res.json());
  }

  // body ={postId, commentId}
  deleteComment(body){
    return this.http
    .patch(
      environment.apiBase + '/api/deletecomment',
      body,
      { withCredentials: true }
    )
    .toPromise()
    .then(res=>res.json());
  }

}
