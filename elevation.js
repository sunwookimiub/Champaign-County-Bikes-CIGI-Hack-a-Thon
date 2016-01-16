//Yaping Cai
//2015-12-19

google.load('visualization', '1', {packages: ['columnchart']});
//
var chartID = ""

//
function getElevation(path,ctID){
	// Create an ElevationService.
	var elevator = new google.maps.ElevationService;
	chartID = ctID;
	// Draw the path, using the Visualization API and the Elevation service.
	elevator.getElevationAlongPath({
	    'path': path,
	    'samples': 256
	  }, plotElevation);

}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(elevations, status) {
  var chartDiv = document.getElementById(chartID);
  if (status !== google.maps.ElevationStatus.OK) {
    // Show the error code inside the chartDiv.
    chartDiv.innerHTML = 'Cannot show elevation: request failed because ' +
        status;
    return;
  }
  // Create a new chart in the elevation_chart DIV.
  var chart = new google.visualization.ColumnChart(chartDiv);

  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Sample');
  data.addColumn('number', 'Elevation');
  for (var i = 0; i < elevations.length; i++) {
    data.addRow(['', elevations[i].elevation]);
  }

  //Shrink map to accomodate chart iframe
  elev = document.getElementById("elevation_chart")
  if (elev.children.length == 0){
    mapDiv = document.getElementById("mapDiv");
    oldHeight = mapDiv.style.height;
    mapDiv.style.height = oldHeight.substr(0,oldHeight.length - 2)*1-150 + "px";
  }

  // Draw the chart using the data within its DIV.
  chart.draw(data, {
    height: 150,
    legend: 'none',
    titleY: 'Elevation (m)'
  });
}
