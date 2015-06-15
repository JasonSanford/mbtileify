var async = require('async');
//var tilelive = require('tilelive');
var tilelive = require("tilelive-streaming")(require("tilelive"), {
  concurrency: 1
});

require('mbtiles').registerProtocols(tilelive);
require('tilelive-http')(tilelive, {concurrency: 2});

var template = 'http://tile.openstreetmap.org/{z}/{x}/{y}.png';

async.parallel(
  {
    source: async.apply(tilelive.load, template),
    sink: async.apply(tilelive.load, 'mbtiles://./tiles.mbtiles')
  },
  function (error, result) {
    console.log(result);

    var source = result.source;
    var sink = result.sink;
    var writeStream = sink.createWriteStream();

    source
      .createReadStream({
        minzoom: 8,
        maxzoom: 14,
        bounds: [-81.06399536132812, 35.41535532818056, -80.82778930664062, 35.70080152485188]
      })
      .pipe(writeStream)
      .on("tile", function(tile) {
        console.log("%d/%d/%d\t%d", tile.z, tile.x, tile.y, tile.length);
      });
  }
);
