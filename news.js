var queryURL = 'https://newsapi.org/v2/everything?' +
'country=us&' +
'apiKey=5f6bee7ae68446d687e4b4e0c9bbad22';

  // Creating an AJAX 
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then();  