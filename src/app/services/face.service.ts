import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FaceService {

  baseUrl = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAUz5OS7yIcPzYX0nHN3RC7FSbexR2iH3U";

  constructor(private http: Http) { }

  detectFace (encodedImg) { // arg: Base64 encoded Image file

    const data =
                {
                  requests:[
                    {
                      image:{
                        content: encodedImg
                      },
                      features:[
                        {
                          type:"FACE_DETECTION",
                          maxResults:3
                        },
                				{
                          type:"LABEL_DETECTION",
                          maxResults:3
                        }
                      ]
                    }
                  ]
                };

    return this.http.post(this.baseUrl, JSON.stringify(data) )
      .toPromise()
      .then(res => res.json());
  }


}
