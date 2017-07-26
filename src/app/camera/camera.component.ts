import { Component, OnInit } from '@angular/core';
import { Http, Request } from '@angular/http';
import { FaceService } from '../services/face.service';
import 'aws-sdk/dist/aws-sdk';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  public webcam//will be populated by ack-webcam [(ref)]
  public base64

  faceAnno: object;
  faceCount: number;
  labelAnno: object;

  launched: boolean = false;
  detected: boolean = false;

  finalPhoto: boolean = false;



  constructor(public http:Http,
              private faceService: FaceService) {
  }

  /*  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  generates Base64 encoded and post to Vision Api
  then Assign res val to "faceAnno" and "labelAnno" variables
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
  visionDetect(){
    return this.webcam.getBase64()
    .then( base=>{
      this.base64=base; // use this to [style.background]
      // cut base64 description to pass as img content to vision api
      const justBase = base.slice(22);

      this.faceService.detectFace(justBase).then(res=>{
        //those are arrays.
        // faceAnno[0] gives first face detected. undefined if no face
        this.faceAnno = res.responses[0].faceAnnotations;
        this.faceCount = res.responses[0].faceAnnotations?
          res.responses[0].faceAnnotations.length: undefined;
        //labelAnno[n].description gives what detected ~ 0~2
        this.labelAnno = res.responses[0].labelAnnotations;

        this.detected = true;
        console.log(this.faceAnno);
        console.log(this.labelAnno);
        console.log(this.faceCount, "faces");
      })
    }) //assign base64 encoded to this.base64
    .catch( e=>console.error(e) )
  }



  //get HTML5 FormData object and pretend to post to server
  genPostData(){
    this.webcam.captureAsFormData({fileName:'file.jpg'})
    .then( formData=>this.postFormData(formData) )
    .catch( e=>console.error(e) )
    // this.genBase64();
  }

  //a pretend process that would post the webcam photo taken
  postFormData(formData){
    const config = {
      method:"post",
      url:"http://www.aviorsciences.com/",
      body: formData
    }
    // console.log("formData (which is body of POST form) passed when captured is : ");
    // console.log(config.body);
    const request = new Request(config);
    // console.log("request with config param is: ")
    // console.log(request);

    return this.http.request( request );

  }

  onCamError(err){}

  onCamSuccess(){
    this.webcam.options = {
      audio: false,
      video: true,
      fallback: true,//force flash
      width: document.getElementById('cameraWrapper').clientWidth,
      height: document.getElementById('cameraWrapper').clientWidth*0.75,
      fallbackSrc: 'jscam_canvas_only.swf',
      cameraType: 'front' || 'back'
    }
    this.launched = true;
  }

  ngOnInit() {
  }

  captureIt(){
    this.finalPhoto = true;
    $('.webcam').addClass('_hidden');
    setTimeout(()=>{
      let width = $('.photoTaken').width();
      $('.photoTaken').height(width*0.75);
    },50)
  }

  minimizeIt(){
    let width = $('.photoTaken').width() *0.3;
    let height = $('.photoTaken').height() *0.3;
    $('.photoTaken').width(width);
    $('.photoTaken').height(height);
  }

  hideCapture(){
      $('.photoTaken').addClass('_hidden');
  }


  fileEvent(fileInput:any){
    let AWS = (<any>window).AWS;
    let file = fileInput.target.files[0];
    // AWS.config.accessKeyId = "";
    // AWS.config.secretAccessKey = "";
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:''});
    AWS.config.region = "us-east-2";
    AWS.config.credentials =  new AWS.Credentials('', '', null );
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    //   {
    //     // accessKeyId : "",
    //     // secretAccessKey : ""
    //   },
    //   {
    //     region: 'us-east-2'
    //   }
    // );
    // { "accessKeyId": "", "secretAccessKey": "", "region": "us-east-1" }
    // AWS.config.loadFromPath('~awsconfig.json');
    // console.log(AWS.CognitoIdentityCredentials);

    console.log("config: ");
    console.log(AWS.config);
    // let bucket = new AWS.S3({params: {Bucket: "alarmmadness"}});
    let s3 = new AWS.S3();
    let params = {Bucket: 'alarmmadness', Key: file.name, Body:file};
    s3.upload(params,function(err,res){
      console.log('error',err);
      console.log('response',res);
    })
  }

}
