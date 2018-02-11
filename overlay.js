var overlay;

ContourOverlay.prototype = new google.maps.OverlayView();

//initialize the map and custom overlay.

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 33.753035, lng: -84.419935},
    mapTypeId: 'roadmap'
  });

  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(33.62337, -84.549580),
    new google.maps.LatLng(33.8827, -84.290289)
  );

  //load d3
  d3.json("https://raw.githubusercontent.com/scarca/AtlCrime/master/data.json", function(data) {
    overlay = new ContourOverlay(bounds, map, data)
  })

}

/** @constructor */
function ContourOverlay(bounds, map, data) {
  //initialize properites
  this.bounds_ = bounds;
  this.map_ = map;
  this.data_ = data;
  xbound = data['xbound'];
  ybound = data['ybound'];
  console.log(xbound, ybound)
  this.sw = new google.maps.LatLng(ybound[0], xbound[0])
  this.ne = new google.maps.LatLng(ybound[1], xbound[1])
  //define property to hold image div.
  this.div_ = null;
  this.cont_group_ = null;
  //call setMap
  this.d3_ = d3
  this.setMap(map);

}

/**
 * onAdd is called when map's panes are ready
 */
ContourOverlay.prototype.onAdd = function() {
  //has contour plots
  var tmp = d3.select(this.getPanes().overlayLayer)
  var div = document.createElement('div')
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';
  this.div = tmp.append("div")
  this.cont_layer = this.div.attr("class", "contour").append("svg:svg");

  //add a group to the svg object; gropus can be affected by the opacity.
  this.cont_group_ = this.cont_layer.append("g").attr("opacity", 0.3);
  console.log(this.cont_group_, this.cont_layer);
  this.c = new Conrec();
  var padX = 0;
  var padY = 0;
  var xs = this.data_.x;
  var ys = this.data_.y;
  var d = this.data_.z;
  var cliff = -100;
      d.push(d3.range(d[0].length).map(function() { return cliff; }));
      d.unshift(d3.range(d[0].length).map(function() { return cliff; }));
      d.forEach(function(nd) {
        nd.push(cliff);
        nd.unshift(cliff);
      });

  var colours = ['#000099','#0000FF','#3399FF','#00CCFF','#00CC00','#66FF00','#FFFF00','#CC0000','#FF6633'],
        zs = [-0.1, 20.0, 50.0, 75.0, 90.0, 95.0, 98.0, 99.0, 99.9, 100.1]
  this.c.contour(d, 0, xs.length - 1, 0, ys.length - 1, xs, ys, zs.length, zs);

}

ContourOverlay.prototype.draw = function() {
  //south-west and north-east of overlay to peg it to the correct position and size
  var projection = this.getProjection();
  var padX = 0;
  var padY = 0;
  //determine the min and max latitudes and longitudes
  //get bounds
  var sw = projection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = projection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
  var div = this.div;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';

  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';

  console.log(sw, ne)

  var colours = ['#000099','#0000FF','#3399FF','#00CCFF','#00CC00','#66FF00','#FFFF00','#CC0000','#FF6633'],
        zs = [-0.1, 20.0, 50.0, 75.0, 90.0, 95.0, 98.0, 99.0, 99.9, 100.1]
  var cont = this.cont_group_.selectAll("path").data(this.c.contourList())
  				// update existing paths
  				.style("fill",function(d) {
  					return colours[zs.indexOf(d.level)-1];
  				})
  				.style("stroke","black")
  				.attr("d",d3.line()
  					// the paths are given in lat and long coordinates that need to be changed into pixel coordinates
  					.x(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).x - padX; })
  					.y(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).y - padY; })
  					)
  				.enter().append("svg:path")
  				.style("fill",function(d) {
  				return colours[zs.indexOf(d.level)-1];
  				})
  				.style("stroke","black")
  				.attr("d",d3.line()
  					// the paths are given in lat and long coordinates that need to be changed into pixel coordinates
  					.x(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).x - padX; })
  					.y(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).y - padY; })
  				);
console.log("Done drawing");
}

//OnRemove is called if we set overlay's map property to null.

// USGSOverlay.prototype.onRemove = function() {
//   this.div_.parentNode.removeChild(this.div_);
//   this.div_ = null;
// };

google.maps.event.addDomListener(window, 'load', initMap);
