var express = require('express');
var bodyParser = require('body-parser');
var kue = require('kue');

var createTiles = require('./create_tiles');

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/jobs/:id', function (req, res) {
  kue.Job.get(req.params.id, function (error, job) {
    res.render('job', {job: job});
  });
});

app.post('/create_tiles', function (req, res) {
  var body       = req.body;
  var tileUrl    = body.tile_url;
  var minZoom    = parseInt(body.min_zoom, 10);
  var maxZoom    = parseInt(body.max_zoom, 10);
  var totalCount = parseInt(body.total_count, 10);
  var bounds     = [
    parseFloat(body.xmin), parseFloat(body.ymin),
    parseFloat(body.xmax), parseFloat(body.ymax)
  ];

  createTiles(minZoom, maxZoom, bounds, tileUrl, totalCount, function (error, job) {
    res.redirect('/jobs/' + job.id);
  });
});

var port = Number(process.env.PORT || 5000);

var server = app.listen(port, function () {
  console.log('listening on port: ', port);
});
