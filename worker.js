var async = require('async');
var knox = require('knox');
var tilelive = require('tilelive-streaming')(require('tilelive'), {
  concurrency: 1
});

var queue = require('./create_queue');

require('mbtiles').registerProtocols(tilelive);
require('tilelive-http')(tilelive);

var constants = require('./constants');

var client = knox.createClient({
    key: constants.awsKeyId,
    secret: constants.awsAccessKey,
    bucket: constants.awsBucket
});

queue.process(constants.fetchTilesQueueName, function (job, done) {
  console.log('Starting job fetching ' + job.data.totalCount + ' tiles.')
  var fileName = job.id + '.mbtiles'
  var filePath = './' + fileName;
  async.parallel(
    {
      source: async.apply(tilelive.load, job.data.tileUrl),
      sink: async.apply(tilelive.load, 'mbtiles://' + filePath)
    },
    function (error, result) {
      var source      = result.source;
      var sink        = result.sink;
      var writeStream = sink.createWriteStream();
      var completed   = 0;

      source
        .createReadStream({
          minzoom: job.data.minZoom,
          maxzoom: job.data.maxZoom,
          bounds: job.data.bounds
        })
        .pipe(writeStream)
        .on('tile', function (tile) {
          completed++;
          job.progress(completed, job.data.totalCount);
        })
        .on('finish', function () {
          client.putFile(filePath, fileName, function (error, resp) {
            if (error) {
              console.log('Error uploading: ', error);
            } else {
              done();
            }
          });
        });
    }
  );
});
