var express = require('express');
var GoogleSpreadsheet = require("google-spreadsheet");
var creds = require('./client_secret.json');

var app = express();
var sheet = new GoogleSpreadsheet('1Ho4S9BGaAGMEfXyIPfue_PazAV1qoUrWRM4s-L24i1A');

sheet.useServiceAccountAuth(creds, function(err) {
  sheet.getInfo(function(err, info) {
    console.log(info.title + ' is loaded.');
  });
});

app.get('/', function(req, res) {
  res.send('Hello World!');
});
