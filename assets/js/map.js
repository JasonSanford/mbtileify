function Map () {
  L.mapbox.accessToken = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6InRJMHZPZFUifQ.F4DMGoNgU3r2AWLY0Eni-w';
  var map = new L.mapbox.Map('map', 'jcsanford.kmdnbkib', {center: [40, -100], zoom: 4});

  return map;
}

module.exports = Map;
