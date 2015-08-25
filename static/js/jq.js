/**
 * Created by jenny on 6/2/15.
 */

//MapBox Permissions
var token = 'pk.eyJ1IjoiZnVuZ2pqOTIiLCJhIjoiYzA1NTcxNTY0MDM0ODVhY2Y5MjA2YTUwOTQ3N2QyY2YifQ.EOjqSe6lYaV5QZSqplq2ug';
var id = 'fungjj92.a91245f4';

//store geolocated user location
function storeCoordinates(lat, lon){
    $.post(
        '/search/findme',
        {'latitude': lat, 'longitude': lon }
    )
        .done(function(data){
            //todo: possibly do something more useful w data
        })
        .fail(function(){
            console.log("Unable to store your coordinates :(")
        });
}

//add features to initialized map
function initmap(map) {
    //Load MapBox map tiles
    var mapTiles = L.tileLayer('https://a.tiles.mapbox.com/v4/fungjj92.a91245f4/page.html?access_token=pk.eyJ1IjoiZnVuZ2pqOTIiLCJhIjoiYzA1NTcxNTY0MDM0ODVhY2Y5MjA2YTUwOTQ3N2QyY2YifQ.EOjqSe6lYaV5QZSqplq2ug',
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: id,
            accessToken: token
        });

    //Add map tiles and geoJSONs
    mapTiles.addTo(map);
    loadJsons(map);

    function showPosition(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //Store coordinates in database
        storeCoordinates(lat, lon);
        //Perform a GPS search, returning a location marker and map zoom
        map.locate({setView: true});
        map.on('locationfound', function (e) {
            //todo: commented out below, add point in polygon search and update marker on-click window descriptions
            $.getJSON($('link[rel="alljson"]').attr("href"), function (data) {
                /*var json = [data];
                 var pip = leafletPip.pointInLayer(
                 [lon, lat], json);
                 if (pip.length){
                 console.log(pip[0].feature.properties)
                 }
                 }); */
                addMarker(lat, lon, map);
                //move map center to zoom around the new marker
                map.fitBounds(e.bounds, {maxZoom: 15});
                $('#geoID').prop('value', 'Find Me!');
            });
            //Catch location-not-found errors. Calls locationErr function.
            map.on('locationerror', locationErr);
        })
    }

    //Function alerts app user with details of the search error
     function locationErr(error) {
         alert("Unable to retrieve your location due to " + error.code + ": " + error.message);
     }

    //Adds geolocation ability to map when "Find Me!" button clicked
    $('#geoID').on('click', function(){
        //change button text to signify searching state
        $(this).prop('value', 'Searching...');
        //handles successful location search and error cases
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, locationErr);
        } else {
        //handles other case of web browser not supporting geolocation service
            alert("Geolocation is not supported by this browser.");
        }
    })

}

function loadJsons(map) {
    //Any reused JSON functions put here
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    //load Municipality JSON
    $.getJSON($('link[rel="munis"]').attr("href"), function (data) {
        //Set highlight functions
        function highlightFeature(e) {
            e.target.setStyle({color: '#00468B'});
        }

        function resetHighlight(e) {
            munis.resetStyle(e.target);
        }

     //Municipality JSON
     var munis = L.geoJson(data, {
         style: function (feature) {
            return {color:"#58c0ff", weight:2};
         },
         onEachFeature: function(feature, layer) {
             var windowText = '<strong>Name: </strong>' + feature.properties.NAME +
            '</br><strong>Code: </strong>'+ feature.properties.CODE +
            '</br><a href="https://www.stlouisco.com/YourGovernment/Municipalities/'+ feature.properties.COUNTY +'/'+ feature.properties.NAME + '">STL Co. Muni Site</a>';
            //todo: '</br>More info to come...';
            layer.on({
             mouseover: highlightFeature,
             mouseout: resetHighlight,
             dblclick: zoomToFeature
            });
            layer.bindPopup(windowText);
         }
     })
     munis.addTo(map);
    });

    //load Ward JSON
     $.getJSON($('link[rel="wards"]').attr("href"), function(data){
         function highlightFeature(e){
            e.target.setStyle({color:'#691F01'});
         }
         function resetHighlight(e){
            wards.resetStyle(e.target);
         }
         var wards = L.geoJson(data, {
            style: function (feature) {
                return {color:"#FF7F50", weight:1.5};
            },
             //Display data in on-click marker window
             onEachFeature: function(feature, layer) {
                 var windowText = '<strong>Ward Name: </strong>' + feature.properties.WARD +
                 '</br><a href="https://www.stlouis-mo.gov/government/departments/aldermen/ward-'+ feature.properties.WARD + '">STL City Ward Site</a>';
                 //todo: '</br>More info to come...';
                 layer.on({
                 mouseover: highlightFeature,
                 mouseout: resetHighlight,
                 dblclick: zoomToFeature
             });
            layer.bindPopup(windowText);
            }
         })
         wards.addTo(map);
     });

    /***************~~~~ Playing around with one JQuery call that loads all JSONs ~~~~****************************
        $.getJSON($('link[rel="alljson"]').attr("href"), function (data) {
            function highlightFeature(e) {
                e.target.setStyle({color: '#691F01'});
            }

            function resetHighlight(e) {
                all.resetStyle(e.target);
            }

            //Animate All JSON features
            var all = L.geoJson(data, {
                style: function (feature) {
                    return {color: "#FF7F50", weight: 1.5};
                },
                //todo properties calling doesn't work yet
                onEachFeature: function (feature, layer) {
                   /* var windowText = '';
                    if (feature.properties.WARD10.length) {
                        windowText.append('<strong>Ward Name: </strong>' + feature.properties.WARD10 +
                            '</br><a href="https://www.stlouis-mo.gov/government/departments/aldermen/ward-' + feature.properties.WARD10 + '">STL City Ward Site</a>' +
                            '</br>More info to come...</br>');
                    }
                    if (feature.properties.NAME.length) {
                        windowText.append('<strong>Name: </strong>' + feature.properties.NAME +
                            '</br><strong>Code: </strong>' + feature.properties.CODE +
                            '</br><a href="https://www.stlouisco.com/YourGovernment/Municipalities/' + feature.properties.COUNTY + '/' + feature.properties.NAME + '">STL Co. Muni Site</a>' +
                            '</br>More info to come...</br>');
                    }
                    if (feature.properties.NHD_NAME.length) {
                        windowText.append('<strong>Neighborhood Name: </strong>' + feature.properties.NHD_NAME +
                            '</br><strong>Neihborhood Number: </strong>' + feature.properties.NHD_NUM +
                            '</br><a href="https://www.stlouis-mo.gov/neighborhoods/profile.cfm?neighborhood=' + feature.properties.NHD_NAME + '">City Neighborhood Site</a>' +
                            '</br>More info to come...</br>');
                    }
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        dblclick: zoomToFeature
                    });
                    //layer.bindPopup(windowText);
                }
            })
            all.addTo(map);
        });

    })

    */
}


function addMarker(lat, long, map, placeName){
    if(placeName === undefined){
        placeName = 'Searched location';
    }
    //create a Mapbox point feature using lat long data
    L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [long, lat]
        },
        properties: {
            title: placeName,
            description: 'For now, click the space around me for the data you seek!',
            'marker-color': '#e5be01',
            'marker-size': 'medium',
        }
    }).addTo(map);
}


$(document).ready(function() {
    //Set MapBox Access
    L.mapbox.accessToken = token;

    //Initialise map to #map div
    var map = L.mapbox.map('map', 'mapbox.streets').setView([38.646899, -90.337648], 10);

    var geocoderControl = L.mapbox.geocoderControl('mapbox.places');
    //todo: explore what info/data is returned in this call using a breakpoint
    geocoderControl.addTo(map);

    //Initialize map features
    $("#map").append(initmap(map));

    //'Enter Street Address' button clicked
    $("#enteraddress").click(function () {
        $(".leaflet-control-mapbox-geocoder").toggleClass("active").find("input").focus();
    });

    //Listen for submitted address. Grab lat/lon data and store.
    $(".leaflet-control-mapbox-geocoder-form").submit(function () {
        var lat, lon, name;
        var input = $(".leaflet-control-mapbox-geocoder-form :input").val();
        geocoderControl.on('found', function(object){
            var json = object.results.features[0];
            console.log(json);
            lat= json.geometry.coordinates[1];
            lon= json.geometry.coordinates[0];
            placeName = json.place_name;
            addMarker(lat, lon, map, placeName);

            //AJAX to db to store address and coordinates
            $.post(
                '/search/new',
                {'address': input, 'latitude': lat, 'longitude': lon, 'fullname': placeName}
            )
            .done(function () {
                //todo: perhaps put something more useful in here
            })
            .fail(function () {
                console.log("Failed to find address entered :(")
            });
        });
    })
})