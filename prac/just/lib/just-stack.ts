import * as cdk from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class JustStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bucket5 = new s3.Bucket(this, 'MyirstBucket',{
      versioned: true,   
    });



    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'JustQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
