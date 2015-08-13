var kue = require('kue');
var url = require('url');

var fetchTilesQueueName = require('./constants').fetchTilesQueueName;

var queue;
if (process.env.REDISTOGO_URL) {
  var redisUrl = url.parse(process.env.REDISTOGO_URL)
  queue = kue.createQueue({
    redis: {
      port: redisUrl.port,
      host: redisUrl.hostname,
      auth: redisUrl.auth.split(':')[1]
    }
  })
} else {
  queue = kue.createQueue()
}

module.exports = function (minZoom, maxZoom, bounds, tileUrl, totalCount, callback) {
  var jobData = {
    minZoom: minZoom,
    maxZoom: maxZoom,
    bounds: bounds,
    tileUrl: tileUrl,
    totalCount: totalCount
  };

  var job = queue.create(fetchTilesQueueName, jobData);
  job.on('enqueue', function () {
    callback(null, job);
  });
  job.save();
};
