//Base map
var map;

// graphic and route vars
var num_points=0;
var route_points = [];
var graphicRoute;
var prevMapPoint;

require(["esri/map", "esri/dijit/Scalebar", "application/bootstrapmap.min", "dojo/query", "dojo/touch", "esri/symbols/SimpleMarkerSymbol","esri/graphic", "esri/geometry/Polyline", "esri/symbols/PictureMarkerSymbol", "esri/geometry/Point", "bootstrap/Collapse", "bootstrap/Dropdown", "esri/geometry/webMercatorUtils", "dojo/domReady!"],
        function(Map, Scalebar, BootstrapMap, query, touch, SimpleMarkerSymbol, Graphic, Polyline, PictureMarkerSymbol, webMercatorUtils, Point) {

            // Get a reference to the ArcGIS Map class
            map = BootstrapMap.create("mapDiv",{
                basemap:"osm",
                center:[-88.272778, 40.115],
                zoom:12
            });
	    
            map.on("load", function() { map.enableScrollWheelZoom(); });

            map.on("click", mapClick);
            var pointGraphic = null;
	    function mapClick(event) {
		var pt = webMercatorUtils.xyToLngLat(event.mapPoint.x, event.mapPoint.y);
                //add point to route_points list
		route_points.push([pt[1], pt[0]]);
                num_points += 1;
		// log points to console
		console.log(route_points);

                //add point to the map
                var startPointSymbol = new PictureMarkerSymbol('http://stm3.mx/imagenes/green_flag.png', 51, 51);
                var midPointSymbol = new PictureMarkerSymbol('http://www.clipartbest.com/cliparts/RcA/K47/RcAK47pcL.png', 51, 51);
                var destPointSymbol = new PictureMarkerSymbol('http://emojipop.net/data/images/emoji_set_468.png', 51, 51);
		
		if (num_points == 1) {
			map.graphics.add(new Graphic(event.mapPoint, startPointSymbol));
		} else if (num_points > 1){
			// clear route
                        map.graphics.remove(graphicRoute);
                        // add midpoint
                        if (prevMapPoint !== null){
                            map.graphics.remove(pointGraphic);
                            map.graphics.add(new Graphic(prevMapPoint, midPointSymbol));
                        }
                        // add destination point
                        pointGraphic = new Graphic(event.mapPoint,destPointSymbol);
                        map.graphics.add(pointGraphic);
                        prevMapPoint = event.mapPoint;
			// draw route
                        drawRouteElev(route_points, map);
                };
           }
       });
