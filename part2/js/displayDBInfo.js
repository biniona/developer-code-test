$(function(){
  //Function to load table.JSON
  //https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
  function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
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
    let MAX_LENGTH = 40;
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
      let loadedJSONFile = JSON.parse(response);
      //Already used deals with duplicate Accession Numbers caused through
      //some works having multiple creator-role fields
      let already_used = [];
      //looping through loaded json
      //https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
      Object.keys(loadedJSONFile).forEach(function(key) {
        //check to see if something has already been loaded for a work
        if (already_used.includes(loadedJSONFile[key].accession_number)) {
          return
        }
        //this is where the display markup is created and added
        $("main").append(
          [
            "<div class = 'art-view' id = '" + loadedJSONFile[key].accession_number + "'>",
              "<div class = 'blocking no-block'>",
                "<img class = 'image art-image' src = 'img/" +  loadedJSONFile[key].accession_number + "_reduced.jpg' alt = '" + loadedJSONFile[key].title + "' >",
              "</div>",
              "<div class = 'art-description'>",
                " <p><i>Title</i> : " + checkLength(loadedJSONFile[key].title) + " </p>",
                " <p><i>Creator</i> : " + checkLength(loadedJSONFile[key].description) + "</p>",
              "</div>",
              "<div class = 'art-description-display'>",
                " <p><i>Title</i> : " + loadedJSONFile[key].title + " </p>",
                " <p><i>Creator</i> : " + loadedJSONFile[key].description + " </p>",
                " <p><i>Accession Number</i> : " + loadedJSONFile[key].accession_number + " </p>",
                " <p><i>Tombstone</i> : " + loadedJSONFile[key].tombstone + " </p>",
                " <p><i>Department</i> : " + loadedJSONFile[key].name + " </p>",
                " <p><i>Creator Role</i> : " + loadedJSONFile[key].role + " </p>",
            "</div>",
            "</div>",
          ].join("\n"));
        //Add escape characters to accension numbers so I can use them as identifiers
        let backSlashEscapeAccession = loadedJSONFile[key].accession_number.replace(/\./g,"\\.");
        //i make the art-description-full invisible so that it is on a different
        //cycle from art description
        $("#"+backSlashEscapeAccession + " > .art-description-display").toggle();
        //this is where the all the click functionality is stored
        $("#"+backSlashEscapeAccession).click(function() {
          //all the displaying is just JQuery toggle functions
          //I toggle visibility to display more or less information
          $("#"+backSlashEscapeAccession + " > .art-description").toggle();
          $("#"+backSlashEscapeAccession + " > .art-description-display").toggle();
          //I toggle between classes to achieve effects
          //
          let idSelector =  $("#"+backSlashEscapeAccession);
          let blockingSelector = $("#"+backSlashEscapeAccession + " .blocking");
          let imageSelector = $("#"+backSlashEscapeAccession + " .image");
          idSelector.toggleClass("art-view");
          idSelector.toggleClass("art-display");
          blockingSelector.toggleClass("block-force");
          blockingSelector.toggleClass("no-block");
          imageSelector.toggleClass("art-image-display");
          imageSelector.toggleClass("art-image");
        });
        //this is to avoid displaying duplicate files. The way creator role
        //db was laid out often pieces were given more than 1 role.
        already_used.push(loadedJSONFile[key].accession_number);
      });
  });
});
