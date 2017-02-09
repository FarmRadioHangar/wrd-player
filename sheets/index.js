var express = require('express');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

var app = express();
var api = new GoogleSpreadsheet('166G5N1h02rYYVwKRUFmcHcOyY3UAXLZ0YPPukxfd7WA');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

api.useServiceAccountAuth(creds, function(err) {
  api.getInfo(function(err, info) {
    console.log(info.title + ' loaded.');
  });
});

app.get('/', function(req, res) {
  api.useServiceAccountAuth(creds, function(err) {
    api.getInfo(function(err, info) {
      var sheet = info.worksheets.filter(sheet => sheet.title === 'Audio');
      if (sheet.length) {
        sheet = sheet[0];
      } else {
        res.status(500).send('Worksheet \'Audio\' missing or inaccessible.')
        return;
      }
      sheet.getRows(function(err, rows) {
        if (err) {
          res.status(500).send('Error getting worksheet rows.')
          return;
        }
        res.send(rows.map(row => ({
          url: row.audiourl,
          length: row.audiolength,
          comments: row.audiocomments,
          question: row.question,
          datetime: row.datereceived,
          row: row.rid
        })));
      });
    });
  });
});

app.listen(3000, function() {
  console.log('App listening on port 3000.');
});
