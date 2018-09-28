var queryURL = "https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries" ///api/open/[version]/[entity]

  // Creating an AJAX 
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then();  
