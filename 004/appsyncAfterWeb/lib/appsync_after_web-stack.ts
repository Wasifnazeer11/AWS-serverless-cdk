import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AppsyncAfterWebStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: 'cdk-api',
      schema: appsync.Schema.fromAsset('graphql/schema.gql'),       ///Path specified for lambda
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,     ///Defining Authorization Type
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))   ///set expiration for API Key
          }
        },
      },
      xrayEnabled: true                                             ///Enables xray debugging
    })

     ///Print Graphql Api Url on console after deploy
     new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl
    })

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });


    ///Lambda Fucntion
    const lambda_function = new lambda.Function(this, "LambdaFucntion", {
      runtime: lambda.Runtime.NODEJS_14_X,            ///set nodejs runtime environment
      code: lambda.Code.fromAsset("lambda"),          ///path for lambda function directory
      handler: 'index.handler',                       ///specfic fucntion in specific file
      timeout: cdk.Duration.seconds(10)               ///Time for function to break. limit upto 15 mins
    })

    const lambda_data_source = api.addLambdaDataSource("lamdaDataSource", lambda_function);


    ///Describing resolver for datasource
    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "hello"
    })

    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "myMessage"
    })
    
    lambda_data_source.createResolver({
      typeName: "Mutation",
      fieldName: "addmyMessage"
    })


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppsyncAfterWebQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
