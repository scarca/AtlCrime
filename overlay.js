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
  this.setMap(map);
}

/**
 * onAdd is called when map's panes are ready
 */
ContourOverlay.prototype.onAdd = function() {
  //has contour plots
  var layer = d3.select(this.getPanes().overlayLayer).append("div")
			.attr("class", "stations");
  layer.attr('position', 'absolute');
	// Add the section that will contain the contour plot
	this.cont_layer = d3.select(this.getPanes().overlayLayer).append("div")
			.attr("class","contour").append("svg:svg");

	// Add a group to the SVG object; groups can be affected by the opacity
	this.cont_group = this.cont_layer.append("g").attr("opacity",0.3);

  this.c = new Conrec();

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
  this.zs = [36, 73, 123, 192, 313, 495, 820, 1186, 1271.87];
  this.colours = ['#000099','#0000FF','#3399FF','#00CCFF','#00CC00','#66FF00','#FFFF00','#CC0000','#FF6633'],
  this.c.contour(d, 0, xs.length - 1, 0, ys.length - 1, xs, ys, this.zs.length, this.zs);

}

ContourOverlay.prototype.draw = function() {
  //south-west and north-east of overlay to peg it to the correct position and size
  var projection = this.getProjection();

  //get bounds
  var sw = projection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = projection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
  var svgWidth = ne.x - sw.x;
  var svgHeight = sw.y - ne.y;

  this.cont_layer
  				.attr("width", ne.x - sw.x + 10000)
  				.attr("height",sw.y - ne.y + 10000)
  				.style("top",ne.y-5000)
  				.style("left",sw.x-5000);

  var colours = this.colours;
  var zs = this.zs;
  var cont = this.cont_group.selectAll("path").data(this.c.contourList())
  				// update existing paths
  				.style("fill",function(d) {
  					return colours[zs.indexOf(d.level)-1];
  				})
  				.style("stroke","black")
  				.attr("d",d3.line()
  					// the paths are given in lat and long coordinates that need to be changed into pixel coordinates
  					.x(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).x; })
  					.y(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).y; })
  					)
  				.enter().append("svg:path")
  				.style("fill",function(d) {
  				return colours[zs.indexOf(d.level)-1];
  				})
  				.style("stroke","black")
  				.attr("d",d3.line()
  					// the paths are given in lat and long coordinates that need to be changed into pixel coordinates
  					.x(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).x; })
  					.y(function(d) { return (projection.fromLatLngToDivPixel(new google.maps.LatLng(d.y, d.x))).y; })
  				);
console.log("Done drawing");
}

//OnRemove is called if we set overlay's map property to null.

// USGSOverlay.prototype.onRemove = function() {
//   this.div_.parentNode.removeChild(this.div_);
//   this.div_ = null;
// };

google.maps.event.addDomListener(window, 'load', initMap);
