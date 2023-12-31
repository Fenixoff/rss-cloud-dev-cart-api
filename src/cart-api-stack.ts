import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

import 'dotenv/config';

export class CartApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cartApitHandler = new nodejs.NodejsFunction(this, 'CartApiHandler', {
      entry: 'dist/main.js',
      runtime: Runtime.NODEJS_20_X,
      environment: {
        DB_URL: process.env.DB_URL,
      },
      timeout: Duration.seconds(10),
    });

    const httpApi = new apigwv2.HttpApi(this, 'CartApi', {
      corsPreflight: {
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowOrigins: ['*'],
        allowHeaders: ['authorization', 'content-type'],
        maxAge: Duration.days(1),
      },
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [
        apigwv2.HttpMethod.GET,
        apigwv2.HttpMethod.POST,
        apigwv2.HttpMethod.PUT,
        apigwv2.HttpMethod.DELETE,
        apigwv2.HttpMethod.PATCH,
      ],
      integration: new HttpLambdaIntegration(
        'CartApiIntegration',
        cartApitHandler,
      ),
    });

    new CfnOutput(this, 'CartApiUrl', {
      value: httpApi.url,
    });
  }
}
