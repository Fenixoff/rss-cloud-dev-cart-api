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
    });

    const httpApi = new apigwv2.HttpApi(this, 'CartApi', {
      corsPreflight: {
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.HEAD],
        allowOrigins: ['*'],
        allowHeaders: ['authorization'],
        maxAge: Duration.days(1),
      },
      defaultIntegration: new HttpLambdaIntegration(
        'CartApiIntegration',
        cartApitHandler,
      ),
    });

    new CfnOutput(this, 'CartApiUrl', {
      value: httpApi.url,
    });
  }
}
