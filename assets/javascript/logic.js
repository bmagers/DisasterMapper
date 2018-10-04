var states = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District of Columbia",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 47.6062, lng: -122.3321},
    zoom: 10
  });
}

function mapLocation(state, county) {
  var countyObj = counties.find(obj => obj.State === state && obj.County === county);
  var latitude = parseFloat(countyObj.Latitude);
  var longitude = parseFloat(countyObj.Longitude);
  var latLng = {lat: latitude, lng: longitude};
  return latLng;
}

$(document).ready(function() {

  $.each(states, function(index, value) {
    var option = $("<option>").text(value).attr("value", index);
    $("#states").append(option);
  });

  $("#states").change(function() {
    $("#counties")
      .css("visibility", "visible")
      .find("option")
      .remove()
      .end()
      .append("<option selected disabled>select a county</option>");
    $.each(counties, function(index, value) {
      if (value.State === $("#states").find(":selected").attr("value")) {
          var option = $("<option>").text(value.County).attr("value", value.County);
          $("#counties").append(option);
        }
    });
  });

  $("#counties").change(function() {
    var state = $("#states").find(":selected").attr("value");
    var county = $("#counties").find(":selected").attr("value");
    var position = mapLocation(state, county);
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
    marker.setMap(map);
    map.setCenter(position);
  });

});