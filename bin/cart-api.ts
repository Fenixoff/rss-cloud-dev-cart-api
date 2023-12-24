#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartApiStack } from '../src/cart-api-stack';

const app = new cdk.App();
new CartApiStack(app, 'CartApiStack');
