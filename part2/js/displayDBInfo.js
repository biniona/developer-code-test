$(function(){
  //Function to load table.JSON
  //https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'table.JSON', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  //Helper function to add ellipses if a string is too long.
  function checkLength(string) {
    var MAX_LENGTH = 50;
    if (string.length > MAX_LENGTH) {
      return string.substring(0, MAX_LENGTH-3)+"...";
    }
    return string
  }

  //THIS IS THE MEAT OF THIS FILE
  //This is where all the click functinoality and DOM manipulation
  //takes place
  loadJSON(function(response) {
      // Parse JSON string into object
      var loadedJSONFile = JSON.parse(response);
      var already_used = []
      //looping through loaded json
      //https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
      Object.keys(loadedJSONFile).forEach(function(key) {
        //check to see if something has already been loaded for a work
        console.log(loadedJSONFile[key])
        if (already_used.includes(loadedJSONFile[key].accession_number)) {
          return
        }
        //this is where the display markup is created and added
        $("main").append(
          [
            "<div class = 'art-view' id = '" + loadedJSONFile[key].accession_number + "'>",
              "<img class = 'art-image' src = 'img/" +  loadedJSONFile[key].accession_number + "_reduced.jpg' alt = '" + loadedJSONFile[key].title + "' >",
              "<div class = 'art-description'>",
                " <p><mark>TITLE : " + checkLength(loadedJSONFile[key].title) + " </mark></p>",
                " <p><mark>CREATOR : " + checkLength(loadedJSONFile[key].description) + " </mark></p>",
              "</div>",
              "<div class = 'art-description-full'>",
                " <p><mark>TITLE : " + loadedJSONFile[key].title + " </mark></p>",
                " <p><mark>CREATOR : " + loadedJSONFile[key].description + " </mark></p>",
                " <p><mark>ACCEESSION NUMBER : " + loadedJSONFile[key].accession_number + " </mark></p>",
                " <p><mark>TOMBSTONE : " + loadedJSONFile[key].tombstone + " </mark></p>",
                " <p><mark>DEPARTMENT : " + loadedJSONFile[key].name + " </mark></p>",
                " <p><mark>CREATOR ROLE : " + loadedJSONFile[key].role + " </mark></p>",
            "</div>",
            "</div>",
          ].join("\n"));
        //Add escape characters to accension numbers so I can use them as identifiers
        var backSlashEscapeAccession = loadedJSONFile[key].accession_number.replace(/\./g,"\\.");
        //i make the art-description-full invisible so that it is on a different
        //cycle from art description
        $("#"+backSlashEscapeAccession + " > .art-description-full").toggle();
        //this is where the all the click functionality is stored
        $("#"+backSlashEscapeAccession).click(function() {
          //all the displaying is just JQuery toggle functions
          //I toggle visibility to display more or less information
          $("#"+backSlashEscapeAccession + " > .art-description").toggle();
          $("#"+backSlashEscapeAccession + " > .art-description-full").toggle();
          //I toggle between classes to achieve effects
          $("#"+backSlashEscapeAccession).toggleClass("art-display")
          $("#"+backSlashEscapeAccession + " > .art-image").toggleClass("art-image-display")
          $("#"+backSlashEscapeAccession + " > .art-description").toggleClass("art-description-display")
        });
        //this is to avoid displaying duplicate files. The way creator role
        //db was laid out often pieces were given more than 1 role.
        already_used.push(loadedJSONFile[key].accession_number);

      });

  });

})
