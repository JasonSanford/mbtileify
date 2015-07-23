var Map = require('./map');

function JobApp () {
  var map = new Map();
  var boundsLayer = new L.GeoJSON(window.mbtileify.jobBoundsGeoJSON, {
    color: '#333',
    opacity: 0.9,
    weight: 2,
    fillColor: '#333',
    fillOpacity: 0.4
  });
  boundsLayer.addTo(map);
  map.fitBounds(boundsLayer.getBounds());
}

module.exports = JobApp;
