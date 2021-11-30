
const express = require("express");
require('./model/module');
const app = express();

app.use(express.json());

app.use(require('./routes/router'));

module.exports = app;