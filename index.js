var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/create_tiles', function (req, res) {
  console.log(JSON.stringify(req.body));
  res.json({ok: 'dude'});
});

var port = Number(process.env.PORT || 5000);

var server = app.listen(port, function () {
  console.log('listening on port: ', port);
});
