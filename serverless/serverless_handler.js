'use strict';

const express = require('express');
const serverlessExpress = require('@codegenie/serverless-express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connectDB = require('../dist/database').default;
connectDB();
const router = require('../dist/routes/index').default;

app.use('/', router);

const server = serverlessExpress({ app });

module.exports.handler = async (event, context) => {
  return server(event, context);
};