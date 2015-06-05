/**
 * Created by jenny on 6/2/15.
 */

//MapBox Permissions
var token = 'pk.eyJ1IjoiZnVuZ2pqOTIiLCJhIjoiYzA1NTcxNTY0MDM0ODVhY2Y5MjA2YTUwOTQ3N2QyY2YifQ.EOjqSe6lYaV5QZSqplq2ug';
var id = 'fungjj92.a91245f4';

function initmap() {
    //Set MapBox Access
    L.mapbox.accessToken = token;
    //Load MapBox map tiles
    var mapTiles = L.tileLayer('https://a.tiles.mapbox.com/v4/fungjj92.a91245f4/page.html?access_token=pk.eyJ1IjoiZnVuZ2pqOTIiLCJhIjoiYzA1NTcxNTY0MDM0ODVhY2Y5MjA2YTUwOTQ3N2QyY2YifQ.EOjqSe6lYaV5QZSqplq2ug',
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: id,
            accessToken: token
        });

    //Instantiate map
    var map = L.mapbox.map('map', 'mapbox.streets').setView([38.646899, -90.337648], 10);
    //Add tiles and todo geoJSONs
    mapTiles.addTo(map);
    loadJsons(map);

    function showPosition(position) {
        var latlon = position.coords.latitude + ", " + position.coords.longitude;
        //todo fix this to work
        map.locate({setView: true});
        map.on('locationfound', function (e) {
            map.fitBounds(e.bounds);
            L.marker([latlon]).addTo(map);
        });
        map.on('locationerror', locationErr);
    }

     function locationErr(error) {
         alert("Unable to retrieve your location due to " + error.code + ": " + error.message);
     }

    //geolocation business
    $('#geoID').on('click', function(){
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, locationErr);
        } else {
        alert("Geolocation is not supported by this browser.");
        }

    })

}

function loadJsons(map){
    //Load JSONs todo
    //Universal JSON functions
    function zoomToFeature(e){
        map.fitBounds(e.target.getBounds());
    }

    $.getJSON($('link[rel="munis"]').attr("href"), function(data){
        //Set highlight functions
        function highlightFeature(e){
            e.target.setStyle({color:'#00468B'});
        }
        function resetHighlight(e){
            munis.resetStyle(e.target);
        }
        //Animate Municipality JSON
        var munis = L.geoJson(data, {
            style: function (feature) {
                return {color:"#58c0ff", weight:2};
            },
            onEachFeature: function(feature, layer) {
                 var windowText = '<strong>Name: </strong>' + feature.properties.NAME +
                        '</br><strong>Code: </strong>'+ feature.properties.CODE +
                        '</br><a href="https://www.stlouisco.com/YourGovernment/Municipalities/'+ feature.properties.COUNTY +'/'+ feature.properties.NAME + '">STL Co. Muni Site</a>' +
                        '</br>More info to come...';
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

    $.getJSON($('link[rel="wards"]').attr("href"), function(data){
        function highlightFeature(e){
            e.target.setStyle({color:'#691F01'});
        }
        function resetHighlight(e){
            wards.resetStyle(e.target);
        }
        //Animate Municipality JSON
        var wards = L.geoJson(data, {
            style: function (feature) {
                return {color:"#FF7F50", weight:1.5};
            },
            onEachFeature: function(feature, layer) {
                 var windowText = '<strong>Ward Name: </strong>' + feature.properties.WARD10 +
                         '</br><a href="https://www.stlouis-mo.gov/government/departments/aldermen/ward-'+ feature.properties.WARD10 + '">STL City Ward Site</a>'+
                         '</br>More info to come...';
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
}

function findAddress(address){
    //todo MapBox Geocoding by Proximity API
    //todo this should be the AJAX request
    $.post(
        '/search/new',
    'http://api.tiles.mapbox.com/v4/geocode/mapbox.places-permanent/'+address+'.json?proximity=38.646899,-90.337648&access_token='+token
    )
}

/*
function geoLocate() {
    //HTML5 Geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        var latlon = position.coords.latitude + ", " + position.coords.longitude;
        //todo fix this to work
        map.render();
        map.on('locationfound', function(e){
            map.fitBounds(e.bounds);
            L.marker([latlon]).addTo(map);
        });
        map.on('locationerror', error(error));
    };
    function error(error){
        alert("Unable to retrieve your location due to "+error.code +": "+error.message);
    };
}

*/

$(document).ready(function(){
    //Initialize map to #map div
    $("#map").append(initmap());
    //Address submitted handler
    $('#geoform').submit(function(event){
        //stop refresh
        event.preventDefault();
        var userInput = $('#address').val();
        findAddress(userInput);
    })
    //Find Me button click handler
    //$('#geoID').on('click', function(){
    //    geoLocate();
    //})
});