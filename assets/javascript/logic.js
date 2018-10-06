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

          let newRow = $("<tr class='get-news-queries'>").append(
            $("<td class='get-title'>").text(disasterInfo[i].title),
            $("<td class='get-type'>").text(disasterInfo[i].incidentType),
            $("<td class='get-state'>").text(state),
            $("<td class='get-area'>").text(county),
            $("<td class='get-start-date'>").text(dateFormat(disasterInfo[i].incidentBeginDate)),
            $("<td class='get-end-date'>").text(dateFormat(disasterInfo[i].incidentEndDate))
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

  //News - generating queries from Fema table row
  $(document).on("click", ".get-news-queries", function(){
    console.log("news button is working")
    
    var getTitle = $(this).closest("tr").find(".get-title").text();  
    var getType = $(this).closest("tr").find(".get-type").text();
    var getState = $(this).closest("tr").find(".get-state").text();
    var getArea = $(this).closest("tr").find(".get-area").text();
    var getSatrtDate = $(this).closest("tr").find(".get-start-date").text();    
    var getEndDate = $(this).closest("tr").find(".get-end-date").text();   

    var getFomarttedTile = getTitle.split(' ').join('+');

    var getFomarttedArea = getArea.split(' ').join('+');

    var newsParam = (getFomarttedArea + "+county+"+ getFomarttedTile + "&" + getType + "+in+" + getState).toLowerCase();
    console.log(newsParam);

    var newsFilterStart = moment(getSatrtDate).format('YYYY-MM-DD');

    var newsFilerEnd;
    if(getEndDate === ""){
      newsFilerEnd = new moment().format('YYYY-MM-DD');
      console.log("current date is " + newsFilerEnd);
    } else {
      newsFilerEnd = moment(getEndDate).format('YYYY-MM-DD');
    }
    //Testing the dates
    console.log("from " + newsFilterStart + " to " + newsFilerEnd)

    var newsQueryURL = 'https://newsapi.org/v2/everything?'
      + 'q=' + newsParam
      + '&from=' + newsFilterStart
      + '&to=' + newsFilerEnd
      + '&sortBy=relevancy'
      + '&apiKey=cd53e9ad02b147df8b2c64a25645e2dd';
      $.ajax({
      url: newsQueryURL,
      method: "GET",
      }).then(function (response) {
          console.log(newsQueryURL);

      var results = response.articles;

      $("#news-view").empty();

      var resultLength = 3;
      //Looping through each result item
      for (var i = 0; i < resultLength; i++) {

        // Creating and storing a div tag
        var articleDiv = $("<div id='article-view col-md-3 card-body'>").text("Related News");

        var articleTitle = "<p id='article-title'>" + results[i].title + "</p>";

        var articleContent = results[i].content;

        var articleDesciption = $("<p>").html("<p style='color:gray;'>Descrition:</p>" + results[i].description);

        var newsTitle = '<a href="#" data-toggle="popover" data-html="true" data-trigger="focus" class="title-view">' + articleTitle + '</a>';

        var articleSource = " read more from "+ results[i].source.id;

        // Converting publishedAt into better time format
        var newsDate = moment(results[i].publishedAt).format('YYYY/MM/DD hh:mm:A');
        var newsPublished = $("<p id='news-reference'>").text("By " + results[i].author + " - " + newsDate );

        // Creating a tag for the news url that contain a image tag
        var newsImageTag = '<img class="rounded" src="' + results[i].urlToImage + '" /> <br/>';

        var newsLink = '<div><p style="color:gray;">Content:</p><span><p>' + articleContent + '</span><a href="' + results[i].url + '" target ="_blank" rel="nofollow">' + articleSource + '</a></p></div>' 

        var articleBreak = "<br/>";

        // Appending the all elements to the articleDiv
        articleDiv.append(newsTitle);
        articleDiv.append(newsPublished);
        articleDiv.append(newsImageTag);
        articleDiv.append(articleBreak);

        // Prependng the articleDiv to the HTML page in the "#news-view" div
        $("#news-view").prepend(articleDiv);

        $(function () {
        $('[data-toggle="popover"]').popover({
          title: articleDesciption,
          content: newsLink
          })
        });
      } // ends loop

    $('.popover-dismiss').popover({
      trigger: 'focus'
    });

  }) // ends Ajax call for news
  
  }); // ends on click event for getting news contents

});