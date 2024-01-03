import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

import 'dotenv/config';

export class CartApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
      integration: new HttpUrlIntegration(
        'CartApiIntegration',
        `${process.env.API_URL}/{proxy}`,
      ),
    });

    new CfnOutput(this, 'CartApiUrl', {
      value: httpApi.url,
    });
  }
}
