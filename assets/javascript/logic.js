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
var markers = [];
var bounds;
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

function dateFormat(dateString) {
  var date = new Date(dateString);
  var year = date.getFullYear();
  if (isNaN(year)) {
    dateFormatted = "";
  } else {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    dateFormatted = month + "/" + day + "/" + year;
  }
  return dateFormatted;
}

function addFilter(filter, newFilter) {
  if (filter.length > 0) {
    return filter + " and " + newFilter;
  }
  return newFilter;
}

function addMarker(position) {
  var marker = new google.maps.Marker ({
    position: position,
    maps: map
  });
  marker.setMap(map);
  markers.push(marker);
  bounds.extend(marker.getPosition());
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
  bounds = new google.maps.LatLngBounds();
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
      .append("<option selected>all counties</option>");
    $.each(counties, function(index, value) {
      if (value.State === $("#states").find(":selected").attr("value")) {
          var option = $("<option>").text(value.County).attr("value", value.County);
          $("#counties").append(option);
        }
    });
  });

  $("#search-btn").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();
    clearMarkers();
    //"title": "FLOOD",
    let title = $("#title-input").val().trim().toUpperCase();
    console.log(title);
    //"incidentType": "Flood",
    let incidentType = $("#incident-type-input").val().trim().toLowerCase();
    console.log(incidentType);
    //"state": "TX",
    let state = $("#states").find(":selected").attr("value");
    //"declaredCountyArea": "",
    let area = $("#counties").find(":selected").attr("value");
    // let area = $("#area-input").val().trim();
    console.log(state);
      //"incidentBeginDate": "1953-06-19T00:00:00.000Z",
    let beginDate = $("#begin-input").val().trim();
    console.log(beginDate);
    //"incidentBeginDate": "1953-06-19T00:00:00.000Z",
    let endDate = $("#end-input").val().trim();
    console.log(endDate);
    
    let queryFilter = "";
    if (title) {
      queryFilter = addFilter(queryFilter, "substringof('" + title + "',title)");
    }
    if (incidentType) {
      incidentType = incidentType[0].toUpperCase() + incidentType.slice(1);
      queryFilter = addFilter(queryFilter, "substringof('" + incidentType + "',incidentType)"); //substringof in api
    }
    if (state) {
      queryFilter = addFilter(queryFilter, "state eq'" + state + "'"); //state eq in API documentation
    }
    if (area) {
      queryFilter = addFilter(queryFilter, "substringof('" + area + "',declaredCountyArea)");
    }
    if (beginDate) {
      beginDate = new Date(beginDate).toISOString();  //api way to format date/times
      queryFilter = addFilter(queryFilter, "incidentBeginDate ge '" + beginDate + "'");
    }
    if (endDate) {
      endDate = new Date(endDate).toISOString(); //api way to format date/times
      queryFilter = addFilter(queryFilter, "incidentEndDate le '" + endDate + "'");
    }
    let femaQueryURL = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=" + queryFilter + "&$orderby=incidentBeginDate%20desc&$select=title,incidentType,declaredCountyArea,state,incidentBeginDate,incidentEndDate&$top=10";
  
    console.log(femaQueryURL);
    $.ajax({
      url: femaQueryURL,
      method: "GET"
    }).then(function(response){ 
      var disasterInfo = response.DisasterDeclarationsSummaries
      console.log(disasterInfo.length);
      console.log(disasterInfo);
      let disasterTable = $("#fema-disasters > tbody").empty();
  
      if (disasterInfo.length === 0) {
        let newRow = $("<tr>").append(
          $("<td>").attr("colspan", 6).text("Your search did not return any results.  Try being less specific and if the event is recent do not enter a end date.")
        );
        disasterTable.append(newRow);
        
      } else {
        for(var i = 0; i < disasterInfo.length; i++) {
          
          var state = disasterInfo[i].state;
          var county = disasterInfo[i].declaredCountyArea.replace(/ *\([^)]*\) */g, "");

          let newRow = $("<tr>").append(
            $("<td>").text(disasterInfo[i].title),
            $("<td>").text(disasterInfo[i].incidentType),
            $("<td>").text(state),
            $("<td>").text(county),
            $("<td>").text(dateFormat(disasterInfo[i].incidentBeginDate)),
            $("<td>").text(dateFormat(disasterInfo[i].incidentEndDate))
          );

          if (state && county) {
            addMarker(mapLocation(state, county));
          }

          // Append the new row to the table
          disasterTable.append(newRow);
        }
      }
      map.fitBounds(bounds);
      console.log("zoom:" + map.getZoom())
      if (map.getZoom() > 10) {
        map.setZoom(10);
      }
    });
  });

});