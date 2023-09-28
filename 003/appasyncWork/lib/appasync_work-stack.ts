import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";




// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppasyncWorkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      versioned: true,
    });

        
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
      },
      defaultRootObject: "index.html",
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.domainName,
    });


    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./website")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
    
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppasyncWorkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
