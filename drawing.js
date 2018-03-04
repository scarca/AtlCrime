//execute after everything has loaded.

function getRandomColor() {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
function initMap(shapes) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      'lat': 33.77679,
      'lng': -84.400279
    },
    mapTypeId: 'roadmap'
  });

  var colours = ['#000099','#0000FF','#3399FF','#00CCFF','#00CC00','#66FF00','#FFFF00','#CC0000','#FF6633'];

  for (i in shapes) {
    //process coordinates
    for (j in shapes[i]['coordinates']) {
      for (k in shapes[i]['coordinates'][j]) {
        shapes[i]['coordinates'][j][k] = new google.maps.LatLng(
          shapes[i]['coordinates'][j][k]['lat'],
          shapes[i]['coordinates'][j][k]['lng']);
      }
      shapes[i]['coordinates'][j] = new google.maps.MVCArray(shapes[i]['coordinates'][j]);
    }
    var coors = new google.maps.MVCArray(shapes[i]['coordinates'])
    var path = new google.maps.Polygon({
      paths: coors,
      strokeColor: colours[i],
      strokeOpacity: 0.2,
      strokeWeight: 3,
      fillColor: colours[i],
      fillOpacity: 0.2
    });
    path.setMap(map);
  }
}
