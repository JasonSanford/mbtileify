var utils = require('./utils');

function App () {
  var me = this;

  this.drawCreated   = utils.bind(this.drawCreated, this);
  this.drawStart     = utils.bind(this.drawStart, this);
  this.drawDeleted   = utils.bind(this.drawDeleted, this);
  this.boundsUpdated = utils.bind(this.boundsUpdated, this);

  this.alertIntro = document.querySelectorAll('.alert-intro')[0];
  this.form       = document.querySelectorAll('.form-horizontal')[0];
  this.boundsXMin = document.querySelectorAll('.bounds-xmin')[0];
  this.boundsYMin = document.querySelectorAll('.bounds-ymin')[0];
  this.boundsXMax = document.querySelectorAll('.bounds-xmax')[0];
  this.boundsYMax = document.querySelectorAll('.bounds-ymax')[0];
  this.zooms      = document.querySelectorAll('.min-zoom, .max-zoom');
  this.minZoom    = document.querySelectorAll('.min-zoom')[0];
  this.maxZoom    = document.querySelectorAll('.max-zoom')[0];

  this.map = new Map();

  this.featureGroup = L.featureGroup();
  this.featureGroup.addTo(this.map);

  this.drawControl = new DrawControl(this.featureGroup);
  this.drawControl.control.addTo(this.map);

  this.map.on('draw:created',   this.drawCreated);
  this.map.on('draw:drawstart', this.drawStart);
  this.map.on('draw:editstop',  this.boundsUpdated);
  this.map.on('draw:deleted',   this.drawDeleted);
  [].forEach.call(this.zooms, function (zoom) {
    zoom.addEventListener('change', function (event) {
      var value = parseInt(this.value, 10);
      if (zoom.classList.contains('min-zoom')) {
        if (value > parseInt(me.maxZoom.value, 10)) {
          this.value = me.maxZoom.value;
        }
      } else {
        if (value < parseInt(me.minZoom.value, 10)) {
          this.value = me.minZoom.value;
        }
      }
    }, false);
  });
}

App.prototype.drawStart = function () {
  this.alertIntro.style.display = 'none';
  this.form.style.display = 'block';
  this.clearCurrentFeature();
};

App.prototype.drawCreated = function (event) {
  this.featureGroup.addLayer(event.layer);
  this.boundsUpdated();
};

App.prototype.drawDeleted = function () {
  this.alertIntro.style.display = 'block';
  this.form.style.display = 'none';
  this.boundsUpdated();
};

App.prototype.clearCurrentFeature = function () {
  this.featureGroup.clearLayers();
};

App.prototype.boundsUpdated = function () {
  var layers = this.featureGroup.getLayers();
  var layer = layers.length ? layers[0] : null;

  if (layer) {
    this.bounds = layer.getBounds();
    var sw = this.bounds.getSouthWest();
    var ne = this.bounds.getNorthEast();

    this.boundsXMin.value = sw.lng;
    this.boundsYMin.value = sw.lat;
    this.boundsXMax.value = ne.lng;
    this.boundsYMax.value = ne.lat;
  } else {
    this.bounds = null;
  }
};

function Map () {
  L.mapbox.accessToken = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6InRJMHZPZFUifQ.F4DMGoNgU3r2AWLY0Eni-w';
  var map = L.mapbox.map('map', 'jcsanford.kmdnbkib');

  return map;
}

function DrawControl (featureGroup) {
  this.control = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup
    },
    draw: {
      polyline: false,
      polygon: false,
      circle: false,
      marker: false,
      rectangle: {
        shapeOptions: {
          color: '#333',
          fillColor: '#333',
          opacity: 1,
          fillOpacity: 0.5,
          weight: 2
        }
      }
    }
  });
}

new App();
