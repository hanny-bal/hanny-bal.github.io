/*
 * Café Map, David Hanny, ST 2024 
 * PS Advanced Cartography and Geovisualisation
 * University of Salzburg
 */

// create a new map with a fullscreen button
var map = new L.Map('map', {
    fullscreenControl: true,
    // OR
    fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }
});

// set center and zoom to Salzburg
map.setView([47.805, 13.04], 12.5);


// ----------- Base layer ----------- //
// Add a base layer, in my case CartoDB voyager. The basemap it is well-suited for navigation (which is important for cafés).
// I don't really see the point of other basemap choices for my purpose.
L.tileLayer('http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);


// ----------- All cafés layer ----------- //
// create a layer with clustering functionality
var overviewLayer = L.markerClusterGroup({
    maxClusterRadius: 45
});

// creates a marker with the coffee icon
var coffeeMarker = L.AwesomeMarkers.icon({
    icon: 'coffee',
    iconColor: 'white',
    prefix: 'fa',
    markerColor: 'black'
});
    
// add markers to the layer
var overviewMarkers = L.geoJson(cafes, {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: coffeeMarker
        });
    },
    onEachFeature: function (feature, layer) {
        // <test> ? if true <operation_1> : else <operation_2> is a short-form if statement
        var address = feature.properties.address ? `Address: ${feature.properties.address}` : "Address not available";
        var openingHours = feature.properties.opening_hours ? `Opening hours: ${feature.properties.opening_hours}` : "Opening hours not available";
        var website = feature.properties.website ? `Website: <a href="${feature.properties.website}" target="_blank">${feature.properties.website}</a>` : "Website not available";
        
        // create some meaningful popup text
        var popupContent = `<b>${feature.properties.name}</b><br>` +
                           `${address}<br>` +
                           `${openingHours}<br>` +
                           `${website}`;
                
        // and add it
        layer.bindPopup(popupContent);
    }      
}).addTo(overviewLayer);
map.addLayer(overviewLayer);


// ----------- Personal recommendations layer ----------- //
// idea: display the cafés I have visited with a review and recommendations
// define a color scale for the markers based on review scores
function getReviewColor(score) {
    return score === '1/5' ? '#d7191c' :
           score === '2/5' ? '#fdae61' :
           score === '3/5' ? '#ffffbf' :
           score === '4/5' ? '#a6d96a' :
           score === '5/5' ? '#1a9641' :
           null;
}


// add a layer with markers
var recommendationMarkers = L.geoJson(cafes, {
    filter: function (feature) {
        if (feature.properties.author_rating != null) { return true }
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.AwesomeMarkers.icon({
                icon: 'coffee',
                iconColor: getReviewColor(feature.properties.author_rating),
                prefix: 'fa',
                markerColor: 'black'
            })
        });
    },
    onEachFeature: function (feature, layer) {
        // <test> ? if true <operation_1> : else <operation_2> is a short-form if statement
        var address = feature.properties.address ? `${feature.properties.address}` : "Address not available";
        
        // create some meaningful popup text
        var popupContent = `<b>${feature.properties.name}</b><br>` +
                           `${address}<br>` +
                           `<b>Rating:</b> ${feature.properties.author_rating}<br>` +
                           `<b>Comment:</b> ${feature.properties.author_comment}<br>` +
                           `<b>Recommendation:</b> ${feature.properties.author_recommendation}<br>`;
                
        // and add it
        layer.bindPopup(popupContent);
    }      
});
var recommendationLayer = L.layerGroup([recommendationMarkers])


// add a legend
var ratingLegend = L.control({position: 'bottomleft'});
ratingLegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');  // div with class info and legend
    var ratings = ['5/5', '4/5', '3/5', '2/5', '1/5']
    div.innerHTML += '<b>Rating</b><br>'

    // loop through the ratings generate a legend line for each
    for (var i = 0; i < ratings.length; i++) {
        div.innerHTML += `<i class="fa fa-coffee fa-outline" style="color:${getReviewColor(ratings[i])}"></i> ${ratings[i]}<br>`;
    }
    return div;
};


// ----------- Heatmap layer ----------- //
// convert the GeoJSON data to a list of coordinates
var cafeCoordinates = cafes.features.map(feature => [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);

// and then create the heatmap layer
var heatmapLayer = L.heatLayer(cafeCoordinates, {minOpacity: 0.5});


// ----------- UI elements ----------- //
// place zoom and fullscreen buttons at the top right
map.zoomControl.setPosition('topright');
map.fullscreenControl.setPosition('topright');

// create a dictionary that stores the map layers and add a layer control
var overlayMaps = {
    'All Cafés': overviewLayer,
    'Recommendations': recommendationLayer,
    'Heatmap': heatmapLayer
};
var layerControl = L.control.layers(overlayMaps).addTo(map);

// add a scalebar
L.control.scale({
    imperial: false,  // no ft here ;)
    position: 'bottomleft'
}).addTo(map);

// display the legend from the recommendation layer only if the layer is visible
recommendationLayer.on('add', function(e) {
    if (map.hasLayer(recommendationLayer)) {
        console.log("adding legend")
        ratingLegend.addTo(map);
    }
 });
 
 recommendationLayer.on('remove', function(e) {
    if (!map.hasLayer(recommendationLayer)) {
        ratingLegend.remove();
    }
 });


// ----------- Search bar ----------- //
// add a search bar for the main layer
map.addControl(new L.Control.Search({
    layer: overviewLayer,
    propertyName: 'name'
}));