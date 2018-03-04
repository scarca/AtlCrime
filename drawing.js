//execute after everything has loaded.

function getRandomColor() {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}
function initMap(shapes) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
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
    var rndcolor = "#1133FF"
    var path = new google.maps.Polygon({
      paths: coors,
      strokeColor: colours[i],
      strokeOpacity: 0.1,
      strokeWeight: 3,
      fillColor: colours[i],
      flilOpacity: 0.1
    });
    path.setMap(map);
  }
  // }
  // for (i in o_shapes) {
  //   //process coordinates
  //   for (j in o_shapes[i]['coordinates']) {
  //     for (k in o_shapes[i]['coordinates'][j]) {
  //       o_shapes[i]['coordinates'][j][k] = new google.maps.LatLng(
  //         o_shapes[i]['coordinates'][j][k]['lat'],
  //         o_shapes[i]['coordinates'][j][k]['lng']);
  //     }
  //     o_shapes[i]['coordinates'][j] = new google.maps.MVCArray(o_shapes[i]['coordinates'][j]);
  //   }
  //   var ncoors = new google.maps.MVCArray(o_shapes[i]['coordinates'])
  //   var nrndcolor = "#333333"
  //   var npath = new google.maps.Polygon({
  //     paths: ncoors,
  //     strokeColor: nrndcolor,
  //     strokeOpacity: 0.8,
  //     strokeWeight: 3,
  //     fillColor: nrndcolor,
  //     flilOpacity: 0.35
  //   });
  //   npath.setMap(map);
  // }
}
