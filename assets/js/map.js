function Map (tileUrl, options) {
  var map;

  var opts = {
    center: [40, -100],
    zoom: 4
  };

  if (options && options.minZoom && options.maxZoom) {
    opts.minZoom = options.minZoom;
    opts.maxZoom = options.maxZoom;
    opts.zoom = options.minZoom;
  }

  if (tileUrl) {
    map = new L.Map('map', opts);
    L.tileLayer(tileUrl).addTo(map);
  } else {
    map = new L.mapbox.Map('map', 'jcsanford.kmdnbkib', opts);
  }

  return map;
}

module.exports = Map;
