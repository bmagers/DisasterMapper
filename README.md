# DisasterMapper

##Content
* Navigation Bar
    - Navigation click events: 
        * when *Icon* is clicked - navigate users to **Home Page**
        * when *Home* is clicked - navigate users to see **Home Page** and **About Page**
        * When *Map* is clicked - navigate users to see **Map Content**
        * When *List* is clicked - navigate  users to see **FEMA table Content**
        * When *Relief* is clicked - navigate users to see **Relief Content**
        * When *About* is clicked - navigate users to see **Map Content**
        * When *Search Button* is clicked - open the *Search Form* which displays in the middle of the page
    - UI Design >> Used Bootstrap [<nav class="navbar navbar-expand-lg navbar-light bg-light">] (https://getbootstrap.com/docs/4.1/components/navbar/)
        - Revision: modifiy **a tag(anchor tag)** content for each *nav-item*:
            * added a **new id** with name convention like "item-focus" ex.*map-focus*
                - purpose: add event handlers to specific element for showing or hiding particular contents
                - EventListener() method used:
                    * $(document).on("click", "#item-focus", function(){ DOM Manipulation Methods }); 
                - DOM Manipulation Methods in jQuery: 
                    * $('selector').show(); // Show the Remove the content of all <div> elements
                    * $('selector').hide(); // Hide the content of all <div> elements
                    * $('selector').empty(); // Remove the content of all <div> elements
                    * $('selector').css("propertyname", "value"); // returns style properties for the selected elements. 
            * insert *div id* inside **href Attribute** as the link that triggers the page go to a specific div. ex.*href="#map-content"* 

* Search Form - queries to the FEMA API   
    - User Inputs:
        * title-input >> label: Name >> validation: text
        * incident-type-input >> label: Incident Type >> validation: text
        * location-input >> label: Location >> validation: dropdowns >> options selcted from states and counties 
        * begin-input >> label: Begin Date >> validation: date picker
        * end-input >> label: End Date >> validation: date picker
    - UI Designed >> Used Bootstrap [<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">](https://getbootstrap.com/docs/4.1/components/modal/)
        - Purpose: enable the page to hide/show the form when a button is clicked:
        - Revision: 
            * delete "close" button
            * insert the **Search Form** content (<form> div) into <div class="modal-body">
            * modify Save changes button to **Search button** by adding an class on it "search-btn".

* Getting Started Content 
    - Added **FEMA report** - see *getFemaStat()* function in *logic.js*
    - Added **search-btn** button - when button is clicked, it trigers the following behaviors:
        * defualt search is called - age will load most recent natural disasters 
        * applied $('selector').show() and $('selector').hide() methods to hide Getting Started Content and show main content as map, list, news, relief and navigation bar        
* Home Page
    - Display the type of natural disasters that helps users the type corresponding terms in the **Search Form**
    - Make **Search Button** more visiable to users - reside in the center of the page 

* About Page 
    - Display goal and mission statement 
        * [User Stories/MVP](https://docs.google.com/document/d/1UTlLpMhqI-b-d7ZD8U7kESzTAisqM6JGUFQBm65dQ54/edit#) 
    - Display contribution and efforts
        * [Project Description Detail](https://docs.google.com/presentation/d/1uG3yY-mff7JTZraP4vf1-pENZlCmK0mEJg3IWYUXD3k/edit#slide=id.g43a5fd99a5_0_118)

* Main Content
    - When search button is clicked, main content will show the following content in this order: 
        1. Map - pinning affected area
        2. List - FEMA results 
        3. News - only when FEMA List item is clicked
        4. Relief - available help actions 


