import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../environments/environment';

@Injectable()
export class YoutubeService {

  constructor(
    private http: Http
  ) { }

  search(q,numberOfItems,token){
    return this.http
    .get(
      `https://www.googleapis.com/youtube/v3/search?maxResults=${numberOfItems}&part=snippet&q=${q}&type=video&key=${environment.googleKey}`
      + (token? `&pageToken=${token}`: ''),
      { withCredentials: true}
    )
    .toPromise()
    .then(res => res.json());
  }

}
