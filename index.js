var express = require('express');
var bodyParser = require('body-parser');
var kue = require('kue');

var createTiles = require('./create_tiles');

var app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function render404 (req, res) {
  res.status(404);
  res.render('404');
}

app.get('/', function (req, res) {
  res.render('index', {
    bodyClass: 'index'
  });
});

app.use('/jobs/:id', function (req, res, next) {
  var id = req.params.id;

  if (!id) {
    render404(req, res);
    return;
  }

  // For some reason /jobs/99.geojson gets passed with '.json' in the slug
  // TODO: There's probably a better way
  if (id.indexOf('.') > -1) {
    id = id.split('.')[0];
  }

  kue.Job.get(id, function (error, job) {
    if (error) {
      render404(req, res);
    } else {
      job = JSON.parse(JSON.stringify(job));
      job.progress = parseInt(job.progress, 10);
      var bounds = job.data.bounds;
      job.boundsGeoJSON = {
        type: 'Polygon',
        coordinates: [
          [
            [bounds[0], bounds[1]],
            [bounds[0], bounds[3]],
            [bounds[2], bounds[3]],
            [bounds[2], bounds[1]],
            [bounds[0], bounds[1]],
          ]
        ]
      }
      req.job = job;
      next();
    }
  });
});

app.get('/jobs/:id.json', function (req, res) {
  res.json(req.job);
});

app.get('/jobs/:id', function (req, res) {
  res.render('job', {
    job: req.job,
    bodyClass: 'job'
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
