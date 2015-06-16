var async = require('async');
var tilelive = require('tilelive-streaming')(require('tilelive'), {
  concurrency: 4
});

require('mbtiles').registerProtocols(tilelive);
require('tilelive-http')(tilelive);

module.exports = function (minZoom, maxZoom, bounds, tileUrl, email) {
  async.parallel(
    {
      source: async.apply(tilelive.load, template),
      sink: async.apply(tilelive.load, 'mbtiles://./tiles.mbtiles')
    },
    function (error, result) {
      var source = result.source;
      var sink = result.sink;
      var writeStream = sink.createWriteStream();

      source
        .createReadStream({
          minzoom: minZoom,
          maxzoom: maxZoom,
          bounds: bounds
        })
        .pipe(writeStream)
        .on('tile', function (tile) {
          console.log("%d/%d/%d\t%d", tile.z, tile.x, tile.y, tile.length);
        })
        .on('finish', function () {
          console.log('Done');
        });
    }
  );
};
