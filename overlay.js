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
  d3.json("./data.json", function(data) {
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
  //define property to hold image div.
  this.div_ = null;
  this.cont_group_ = null;
  //call setMap
  this.setMap(map);

}

/**
 * onAdd is called when map's panes are ready
 */
ContourOverlay.prototype.onAdd = function() {
  //has contour plots
  var projection = this.getProjection();

  var cont_layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "contour")
    .append("svg:svg");

  //add a group to the svg object; gropus can be affected by the opacity.
  this.cont_group_ = cont_layer.append("g").attr("opacity", 0.3);
  var cont_group = this.cont_group_;
  var sw = projection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = projection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
  cont_layer.attr('width', ne.x - sw.x).attr("height", ne.y - sw.y)
    .style("position", "absolute").style("top", ne.y).style("left", sw.x);
}

ContourOverlay.prototype.draw = function() {
  //south-west and north-east of overlay to peg it to the correct position and size
  var projection = this.getProjection();

  //determine the min and max latitudes and longitudes
  //get bounds



  var c = new Conrec();
  xs = this.data_.x;
  ys = this.data_.y;
  d = this.data_.z;
  c.contour(d, 0, xs.length - 1, 0, ys.length - 1, xs, ys);
  var cont = this.cont_group_.selectAll("path").data(c.contourList())
				// update existing paths
				.style("fill",function(d) {
					return colours[zs.indexOf(d.level)-1];
				})
				.style("stroke","black")
				.attr("d",d3.svg.line()
					// the paths are given in lat and long coordinates that need to be changed into pixel coordinates
					.x(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).x - padX; })
					.y(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).y - padY; })
					)
				.enter().append("svg:path")
				.style("stroke","black")
				.attr("d",d3.svg.line()
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
