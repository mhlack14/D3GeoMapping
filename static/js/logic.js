console.log("test")
console.log("Is the web page connected, yes")


//Bring in API key here since no Config FIle

var API_KEY = "pk.eyJ1IjoibWhsYWNrMTQiLCJhIjoiY2tieHB1dnAyMHM0ajJ4cGMwYzF2b3U4eiJ9.yoAWKhaO6lsWj6AxnygI8g";

//Get the background Map from what we've been using for the various activities

var earthquakeMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Create a baseMaps object to hold the earthquake layer map set Jerusalem as the center point 
  var basemap = L.map("map", {
    center: [31.7719, 35.2170],
    zoom: 3
   
  });

//put the earthquake map layer atop our basemap
earthquakeMap.addTo(basemap);

//At this point we have just an empty world map with no data in it. Next is to bring in the Earthquake data from the URL
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) { 
console.log(data);

		//determine circle sizes by radius 
	function radiusSize(magnitude) {
		return magnitude * 6;
  }
console.log(radiusSize);
  
  
		//determine the circle's color based on earthquake magnitude
	function circleColor(magnitude) {
		if (magnitude < 1) {
			return "#ccff33"
		}
		else if (magnitude < 2) {
			return "#ffff33"
		}
		else if (magnitude < 3) {
			return "#ffcc33"
		}
		else if (magnitude < 4) {
			return "#ff9933"
		}
		else if (magnitude < 5) {
			return "#ff6633"
		}
		else {
			return "#ff3333"
		}
	}
console.log(circleColor);

		
	//create style
	function markerstyle(feature) {
		return {
			opacity: 2,
			fillOpacity:.9,
			stroke: true,
			fillColor: circleColor(feature.properties.mag),
			color: "#000",
			radius: radiusSize(feature.properties.mag),
		};
	}
console.log(markerstyle);
	
	
	L.geoJson(data, {
		//make datapoints on map into a circle
		pointToLayer: function(feature,latlng) {
			return L.circleMarker(latlng);
	},
	//Bind Popup to layer map
	onEachFeature: function(feature, layer) {
		layer.bindPopup("magnitude of earthquake:" +feature.properties.mag +"<br>Location:" +feature.properties.place);
	}, 
	//pass in the above function for style
	style:markerstyle
	
}).addTo(basemap);

//Make the Legend
	var Legend = L.control({
		position: "topright"
	});
	
	// add circlemarker data info to legend
  Legend.onAdd = function() {
    var magnitudes = [0,1,2,3,4,5];
    var colors = ["#ccff33","#ffff33","#ffcc33","#ff9933","#ff3333","#ff3333"];
	var div = L.DomUtil.create("div", "info legend");
	
	
	//loop
	for (var i = 0; i < colors.length; i++) {
      div.innerHTML +=
        '<li style="background-color:' + colors[i] + '">' + magnitudes[i] + '</li>';
    }
	return div;
    
  };
     
 //add legend object to map  
  Legend.addTo(basemap);
}
);
