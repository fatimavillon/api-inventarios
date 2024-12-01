const express = require('express');
const serverless = require('serverless-http');
const inventoryController = require('./inventoryController');

const app = express();
app.use(express.json());

app.use('/inventory', inventoryController);

module.exports.handler = serverless(app);
