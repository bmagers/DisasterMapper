
 

$("#add-employee-btn").on("click", function(event) {
  // Don't refresh the page!
  event.preventDefault();
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
  // if (area.length > 0) {
  //   queryFilter = addFilter(queryFilter, "(substringof('" + area.toUpperCase() + "',state) or substringof('" + area + "',declaredCountyArea))");
  // }
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
        
        let newRow = $("<tr>").append(
          $("<td>").text(disasterInfo[i].title),
          $("<td>").text(disasterInfo[i].incidentType),
          $("<td>").text(disasterInfo[i].state),
          $("<td>").text(disasterInfo[i].declaredCountyArea),
          $("<td>").text(dateFormat(disasterInfo[i].incidentBeginDate)),
          $("<td>").text(dateFormat(disasterInfo[i].incidentEndDate))
        );

        // Append the new row to the table
      disasterTable.append(newRow);
      }
    }
  });
});

function dateFormat(dateString) {
  var date = new Date(dateString);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  dateFormatted = month + "/" + day + "/" + year;
  return dateFormatted;
}

function addFilter(filter, newFilter) {
  if (filter.length > 0) {
    return filter + " and " + newFilter;
  }
  return newFilter;
}
  // Creating an AJAX 
 