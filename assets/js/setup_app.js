var cover = require('tile-cover');

var Map   = require('./map');
var utils = require('./utils');

function SetupApp () {
  var me = this;

  this.drawCreated    = utils.bind(this.drawCreated, this);
  this.drawStart      = utils.bind(this.drawStart, this);
  this.drawDeleted    = utils.bind(this.drawDeleted, this);
  this.boundsUpdated  = utils.bind(this.boundsUpdated, this);
  this.tileUrlChanged = utils.bind(this.tileUrlChanged, this);
  this.onsubmit       = utils.bind(this.onsubmit, this);

  this.alertIntroElem       = document.querySelectorAll('.alert-intro')[0];
  this.formElem             = document.querySelectorAll('.form-horizontal')[0];
  this.boundsXMinHiddenElem = document.querySelectorAll('.bounds-xmin-hidden')[0];
  this.boundsYMinHiddenElem = document.querySelectorAll('.bounds-ymin-hidden')[0];
  this.boundsXMaxHiddenElem = document.querySelectorAll('.bounds-xmax-hidden')[0];
  this.boundsYMaxHiddenElem = document.querySelectorAll('.bounds-ymax-hidden')[0];
  this.totalCountElem       = document.querySelectorAll('.total-count')[0];
  this.zoomElems            = document.querySelectorAll('.min-zoom, .max-zoom');
  this.minZoomElem          = document.querySelectorAll('.min-zoom')[0];
  this.maxZoomElem          = document.querySelectorAll('.max-zoom')[0];
  this.tileUrlElem          = document.querySelectorAll('.tile-url')[0];

  this.map = new Map();
  this.overlayTileLayer = new L.TileLayer(this.tileUrlElem.value, {maxZoom: 20});
  this.map.addLayer(this.overlayTileLayer);

  this.featureGroup = L.featureGroup();
  this.featureGroup.addTo(this.map);

  this.drawControl = new DrawControl(this.featureGroup);
  this.drawControl.control.addTo(this.map);

  this.tileCountDisplay = new TileCountDisplay();

  this.map.on('draw:created',   this.drawCreated);
  this.map.on('draw:drawstart', this.drawStart);
  this.map.on('draw:editstop',  this.boundsUpdated);
  this.map.on('draw:deleted',   this.drawDeleted);

  this.tileUrlElem.oninput = this.tileUrlChanged;
  this.formElem.onsubmit = this.onsubmit;

  [].forEach.call(this.zoomElems, function (zoom) {
    zoom.addEventListener('change', function (event) {
      var value = parseInt(this.value, 10);
      if (zoom.classList.contains('min-zoom')) {
        if (value > parseInt(me.maxZoomElem.value, 10)) {
          this.value = me.maxZoomElem.value;
        } else {
          me.calculateTileCover();
        }
      } else {
        if (value < parseInt(me.minZoomElem.value, 10)) {
          this.value = me.minZoomElem.value;
        } else {
          me.calculateTileCover();
        }
      }
    }, false);
  });
}

SetupApp.prototype.onsubmit = function (event) {
  if (!this.bounds) {
    window.alert('Use the draw controls on the map to create a bounding box for the area to fetch tiles.')
    event.preventDefault();
  }
};

SetupApp.prototype.tileUrlChanged = function () {
  this.overlayTileLayer.setUrl(this.tileUrlElem.value);
};

SetupApp.prototype.drawStart = function () {
  this.alertIntroElem.style.display = 'none';
  this.tileCountDisplay.show();
  this.clearCurrentFeature();
};

SetupApp.prototype.drawCreated = function (event) {
  this.featureGroup.addLayer(event.layer);
  this.boundsUpdated();
};

SetupApp.prototype.drawDeleted = function () {
  this.alertIntroElem.style.display = 'block';
  this.tileCountDisplay.clear();
  this.tileCountDisplay.hide();
  this.boundsUpdated();
};

SetupApp.prototype.clearCurrentFeature = function () {
  this.featureGroup.clearLayers();
};

SetupApp.prototype.boundsUpdated = function () {
  var layers = this.featureGroup.getLayers();
  var layer = layers.length ? layers[0] : null;

  if (layer) {
    this.bounds = layer.getBounds();
    var sw = this.bounds.getSouthWest();
    var ne = this.bounds.getNorthEast();

    this.boundsXMinHiddenElem.value = sw.lng;
    this.boundsYMinHiddenElem.value = sw.lat;
    this.boundsXMaxHiddenElem.value = ne.lng;
    this.boundsYMaxHiddenElem.value = ne.lat;

    this.calculateTileCover();
  } else {
    this.bounds = null;
  }
};

SetupApp.prototype.calculateTileCover = function () {
  var minZoom = parseInt(this.minZoomElem.value, 10);
  var maxZoom = parseInt(this.maxZoomElem.value, 10);

  var sw = this.bounds.getSouthWest();
  var ne = this.bounds.getNorthEast();

  var geom = {
    type: 'Polygon', coordinates: [
      [
        [sw.lng, sw.lat],
        [sw.lng, ne.lat],
        [ne.lng, ne.lat],
        [ne.lng, sw.lat],
        [sw.lng, sw.lat]
      ]
    ]
  };

  var tiles = {};

  for (var i = minZoom; i <= maxZoom; i++) {
    tiles[i] = cover.tiles(geom, { min_zoom: i, max_zoom: i });
  }

  this.tileCountDisplay.update(tiles);
  this.totalCountElem.value = this.tileCountDisplay.getTotal()
  this.tileCountDisplay.show();
};

function TileCountDisplay () {
  this.container = document.querySelectorAll('.tile-count-display')[0];
  this.display = document.querySelectorAll('.tile-count')[0];
}

TileCountDisplay.prototype.update = function (tiles) {
  var zoom, zoomTiles;
  var htmlParts = [];
  var totalCount = 0;

  for (zoom in tiles) {
    zoomTiles = tiles[zoom];
    totalCount += zoomTiles.length;
    htmlParts.push('<h4>' + zoom + ': <small>' + zoomTiles.length + '</small></h4>');
  }

  this.total = totalCount;

  htmlParts.push('<hr>');
  htmlParts.push('<h4>Total: <small>' + totalCount + '</small></h4>');

  this.display.innerHTML = htmlParts.join('');
};

TileCountDisplay.prototype.clear = function () {
  this.display.innerHTML = '';
};

TileCountDisplay.prototype.show = function () {
  this.container.style.display = 'block';
};

TileCountDisplay.prototype.hide = function () {
  this.container.style.display = 'none';
};

TileCountDisplay.prototype.getTotal = function () {
  return this.total;
};

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

module.exports = SetupApp;
