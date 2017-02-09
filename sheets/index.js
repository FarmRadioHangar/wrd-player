var express = require('express');
var GoogleSpreadsheet = require("google-spreadsheet");
var creds = require('./client_secret.json');

var app = express();
var api = new GoogleSpreadsheet('1Ho4S9BGaAGMEfXyIPfue_PazAV1qoUrWRM4s-L24i1A');

api.useServiceAccountAuth(creds, function(err) {
  api.getInfo(function(err, info) {
    console.log(info.title + ' is loaded.');
  });
});

app.get('/', function(req, res) {
  api.useServiceAccountAuth(creds, function(err) {
    api.getInfo(function(err, info) {

      var sheet = info.worksheets[0];
      sheet.getRows(function(err, rows) {
        //
      });

      res.send(JSON.stringify(info));

    });
  });
});

app.listen(3000, function() {
  console.log('App listening on port 3000.');
});
