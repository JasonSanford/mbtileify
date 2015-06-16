var kue = require('kue');

var fetchTilesQueueName = require('./constants').fetchTilesQueueName;

var queue = kue.createQueue();

module.exports = function (minZoom, maxZoom, bounds, tileUrl, callback) {
  var jobData = {
    minZoom: minZoom,
    maxZoom: maxZoom,
    bounds: bounds,
    tileUrl: tileUrl
  };

  var job = queue.create(fetchTilesQueueName, jobData);
  job.on('enqueue', function () {
    callback(null, job);
  });
  job.save();
};
