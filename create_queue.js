var kue = require('kue');
var url = require('url');

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

module.exports = queue;
