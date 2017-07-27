import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
// AWS = require('aws-sdk');
import * as uuid from 'node-uuid';
// uuid = require('node-uuid');

@Injectable()
export class AwsService {
  // Create an S3 client
  s3 = new AWS.S3();

  bucketName = 'alarmmadness' + uuid.v4();

  uploade(){
    // Create a bucket and upload something into it
    var keyName = 'hello_world.txt';

    this.s3.createBucket({Bucket: this.bucketName}, function() {
      let params = {Bucket: this.bucketName, Key: keyName, Body: 'Hello World!'};
      this.s3.putObject(params, function(err, data) {
        if (err)
          console.log(err)
        else
          console.log("Successfully uploaded data to " + this.bucketName + "/" + keyName);
      });
    });
  }

  constructor() { }

}
