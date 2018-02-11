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
    console.log(data);
    overlay = new ContourOverlay(bounds, map, data)
  })

}

/** @constructor */
function ContourOverlay(bounds, map, data) {
  console.log(data);
  //initialize properites
  this.bounds_ = bounds;
  this.map_ = map;
  this.data_ = data;
  xbound = data['xbound'];
  ybound = data['ybound'];
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
  this.cont_layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "contour")
    .append("svg:svg");

  //add a group to the svg object; gropus can be affected by the opacity.
  this.cont_group_ = this.cont_layer.append("g").attr("opacity", 0.3);
  var cont_group = this.cont_group_;

}

ContourOverlay.prototype.draw = function() {
  //south-west and north-east of overlay to peg it to the correct position and size
  var projection = this.getProjection();

  //determine the min and max latitudes and longitudes
  //get bounds
  var sw = projection.fromLatLngToDivPixel(this.sw);
  var ne = projection.fromLatLngToDivPixel(this.ne);
  this.cont_layer.attr('width', Math.abs(ne.x - sw.x)).attr("height", Math.abs(ne.y - sw.y))
    .style("position", "absolute").style("top", ne.y).style("left", sw.x);


  var c = new Conrec();
  padX = 0;
  padY = 0;
  xs = this.data_.x;
  ys = this.data_.y;
  d = this.data_.z;
  var colours = ['#000099','#0000FF','#3399FF','#00CCFF','#00CC00','#66FF00','#FFFF00','#CC0000','#FF6633'],
				zs = [-0.1, 20.0, 50.0, 75.0, 90.0, 95.0, 98.0, 99.0, 99.9, 100.1]
  c.contour(d, 0, xs.length - 1, 0, ys.length - 1, xs, ys, zs.length, zs);
  var cont = this.cont_group_.selectAll("path").data(c.contourList())
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

}

//OnRemove is called if we set overlay's map property to null.

// USGSOverlay.prototype.onRemove = function() {
//   this.div_.parentNode.removeChild(this.div_);
//   this.div_ = null;
// };

google.maps.event.addDomListener(window, 'load', initMap);
