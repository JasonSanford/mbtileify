var request = require('superagent');

var Map = require('./map');

function JobApp () {
  var map = new Map(mbtileify.jobTileUrl, {minZoom: mbtileify.jobMinZoom, maxZoom: mbtileify.jobMaxZoom});
  var boundsLayer = new L.GeoJSON(window.mbtileify.jobBoundsGeoJSON, {
    color: '#333',
    opacity: 0.9,
    weight: 2,
    fillColor: '#333',
    fillOpacity: 0.4
  });
  boundsLayer.addTo(map);
  map.fitBounds(boundsLayer.getBounds());

  if (mbtileify.jobProgress < 100) {
    initiateJobProgress()
  }
}

function initiateJobProgress () {
  var inerval;
  var progressBarElem = document.querySelectorAll('.progress-bar')[0];

  function checkProgress () {
    request
      .get('/jobs/' + window.mbtileify.jobId + '.json')
      .end(processProgress);
  }

  function processProgress (error, resp) {
    if (error) {
      window.clearInterval(interval);
      console.log('Error fetching progress: ', error);
      return;
    }

    var body               = resp.body;
    var percentage         = (body.progress >= 100 ? 99 : body.progress);
    var progressPercentage = percentage + '%'

    progressBarElem.style.width = progressPercentage;
    progressBarElem.innerText   = progressPercentage;

    if (body.state === 'complete') {
      window.clearInterval(interval);
      document.location.reload(true);
    }
  }

  interval = window.setInterval(checkProgress, 3000);
}

module.exports = JobApp;
