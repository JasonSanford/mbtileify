var express = require('express');

var app = express();

app.use(express.static('assets'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

var port = Number(process.env.PORT || 5000);

var server = app.listen(port, function () {
  console.log('listening on port: ', port);
});
