var async = require('async');
var kue = require('kue');
var tilelive = require('tilelive-streaming')(require('tilelive'), {
  concurrency: 1
});

require('mbtiles').registerProtocols(tilelive);
require('tilelive-http')(tilelive);

var queue = kue.createQueue();

var fetchTilesQueueName = require('./constants').fetchTilesQueueName;

queue.process(fetchTilesQueueName, function (job, done) {
  console.log('Starting job fetching ' + job.data.totalCount + ' tiles.')
  async.parallel(
    {
      source: async.apply(tilelive.load, job.data.tileUrl),
      sink: async.apply(tilelive.load, 'mbtiles://./tiles.mbtiles')
    },
    function (error, result) {
      var source      = result.source;
      var sink        = result.sink;
      var writeStream = sink.createWriteStream();
      var completed = 0;

      source
        .createReadStream({
          minzoom: job.data.minZoom,
          maxzoom: job.data.maxZoom,
          bounds: job.data.bounds
        })
        .pipe(writeStream)
        .on('tile', function (tile) {
          console.log("%d/%d/%d\t%d", tile.z, tile.x, tile.y, tile.length);
          completed++;
          job.progress(completed, job.data.totalCount);
        })
        .on('finish', function () {
          console.log('Done with tileification');
          done();
        });
    }
  );
});
