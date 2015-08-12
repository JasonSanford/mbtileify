function Map (tileUrl, options) {
  var map;

  var opts = {
    center: [40, -100],
    zoom: 4,
    maxZoom: 20
  };

  if (options && options.minZoom && options.maxZoom) {
    opts.minZoom = options.minZoom;
    opts.maxZoom = options.maxZoom;
    opts.zoom = options.minZoom;
  }

  map = new L.Map('map', opts);

  if (tileUrl) {
    L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
  }

  return map;
}

module.exports = Map;
