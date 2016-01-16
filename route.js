/**
 * Call the viaroute service API and decode the Geometry data. 
 * Then use the data to draw the route as a polyline and display elevation data.
 * @param {array} locArr - Array of 2d arrays containing longitude and latitude of a point location
 */
function drawRouteElev (locArr, map) {
    require(["dojo/request"], function(request){
        request("http://141.142.168.53:5000/viaroute?" + getLocLatStr(locArr) + "instructions=true").then(function(data){
            console.log(data);
            // Decode
            decodedGeo = getDecodedGeometry(data);
            decodedGeoArray = decodedGeo[0];
            decodedGeoJson = decodedGeo[1];

            // Draw Line
            var polyline;
            require(["esri/geometry/Polyline","esri/graphic", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/geometry/Extent"], function(Polyline, Graphic, SimpleLineSymbol, Color, Extent){ 
                var polylineJson = {
                    "paths":[decodedGeoArray],
                    "spatialReference":{"wkid":4326}
                };
                polyline = new Polyline(polylineJson);
                var fillSymbol = new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color('#0099FF'), 
                    5
                    );
                graphicRoute = new Graphic(polyline, fillSymbol);
                map.graphics.add(graphicRoute);
                polyExtent = polyline.getExtent();
                map.setExtent(polyExtent.expand(1.5));
                console.log(polyExtent);
            });
            
            // Draw Elevation
            getElevation(decodedGeoJson, 'elevation_chart');

            ;
        }, function(err){
        }, function(evt){
        });
    });
}

/** 
 * Takes the input of array of locations and returns a string for the request
 * @param {array} locArr - Array of 2d arrays containing longitude and latitude of a point location
 */
function getLocLatStr(locArr){
    retStr = "";
    for (i = 0; i < locArr.length; i++){
	retStr += "loc=" + locArr[i][0] + "," + locArr[i][1] + "&"
    }
    return retStr;
}

/**
 * Gets the decoded data from viaroute service API
 * @param {json} data - json data returned from the viaroute service API
 */
function getDecodedGeometry(data){
    var obj = JSON.parse(data);
    encodedGeo = obj["route_geometry"];
    decodedGeo = decodePoly(encodedGeo);
    return decodedGeo;
}

/**
 * Gets the geometry from encoding
 * @param {string} encodedPoly - The encoded route geometry
 */
function decodePoly(encodedPoly) {
  index = lat = lng = 0;
  len = encodedPoly.length;
  retArray = [];
  retJson = [];
  while (index < len) {
    b = shift = result = 0;
    do {
      b = encodedPoly.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = result = 0;
    do {
      b = encodedPoly.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    retLng = lng / 1E6;
    retLat = lat / 1E6;
    tempArray = [retLng, retLat];
    tempJson = {"lat":retLat, "lng":retLng};
    retArray.push(tempArray);
    retJson.push(tempJson);
  }
  retVal = [retArray, retJson];
  return retVal;
}
