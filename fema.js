
 

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
  if (title.length > 0) {
    queryFilter = addFilter(queryFilter, "substringof('" + title + "',title)");
  }
  if (incidentType.length > 0) {
    incidentType = incidentType[0].toUpperCase() + incidentType.slice(1);
    queryFilter = addFilter(queryFilter, "substringof('" + incidentType + "',incidentType)");
  }
  // if (area.length > 0) {
  //   queryFilter = addFilter(queryFilter, "(substringof('" + area.toUpperCase() + "',state) or substringof('" + area + "',declaredCountyArea))");
  // }
  if (state.length >= 2) {
    queryFilter = addFilter(queryFilter, "substringof('" + state + "',state)");
  }
  if (area.length > 0) {
    queryFilter = addFilter(queryFilter, "substringof('" + area + "',declaredCountyArea)");
  }
  if (beginDate.length > 0) {
    beginDate = new Date(beginDate).toISOString();
    queryFilter = addFilter(queryFilter, "incidentBeginDate ge '" + beginDate + "'");
  }
  if (endDate.length > 0) {
    endDate = new Date(endDate).toISOString();
    queryFilter = addFilter(queryFilter, "incidentEndDate le '" + endDate + "'");
  }
  let queryURL = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=" + queryFilter + "&$orderby=incidentBeginDate%20desc&$select=title,incidentType,declaredCountyArea,state,incidentBeginDate,incidentEndDate&$top=10";

  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){ 
    var disasterInfo = response.DisasterDeclarationsSummaries
    console.log(disasterInfo.length);
    console.log(disasterInfo);
  });
});

function addFilter(filter, newFilter) {
  if (filter.length > 0) {
    return filter + " and " + newFilter;
  }
  return newFilter;
}
  // Creating an AJAX 
 