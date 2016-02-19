// This is the first file loaded by the require.js library.
// We want to first set up some configuration for require.js before doing
// anything else.
require.config({

  // require.js will automatically look for scripts in the current file path
  // relative to this file. For scripts that are not located in this file path,
  // we need to define an alternate path. Both of the scripts below are going to
  // be loaded from a CDN (content delivery network), which is a special type of
  // server optimized for static asset content. So we'll just provide require.js
  // with the full URL (except for the trailing ".js") so that it knows where to
  // find these scripts when we ask for them.
  paths: {
    jquery: "https://code.jquery.com/jquery-2.2.0.min",
    firebase: "https://cdn.firebase.com/js/client/2.4.0/firebase"
  },

  // The Firebase script is a straight Javascript file, not a module. We use
  // this additional config to tell require.js how to handle the script, by
  // pretending that it is a module that exports an object called Firebase.
  shim: {
    'firebase': {
      exports: 'Firebase'
    }
  }

});

// Now that we've configured require.js, use it! The body of our application.js
// is inside this callback function. But before that can be run, load the
// jQuery library (using the custom config path above) and the database module
// (which is defined in database.js, in this same directory). Pass the objects
// returned by those scripts as objects (named $ and Database) to the callback
// function, and run that function when both are loaded.
require(["jquery", "database"], function ($, Database) {

  // Save a new recommendation to the database, using the input in the form
  var submitRecommendation = function () {

    // Get input values from each of the form elements, using jQuery library.
    // The # indicates that we're looking for an HTML element with this id.
    var title = $("#talkTitle").val();
    var presenter = $("#talkPresenter").val();
    var link = $("#talkLink").val();

    // Get unique user id from the authenticated user that is using this app
    var authData = Database.getAuthData();
    var uid = authData.uid;

    // If the user has logged in using Twitter, get their Twitter username
    // and display name
    var twitter = {};

    if (authData.twitter != null) {
      twitter.username = authData.twitter.username;
      twitter.displayName = authData.twitter.displayName;
    }

    Database.saveRecommendation(
      // The recommendation object that we are saving to the database
      {
        "title": title,
        "presenter": presenter,
        "link": link,
        "uid": uid,
        "twitter": twitter
      },

      // When the request to the database is complete, call this function. If
      // there was an error, pass the error object as the first argument. If
      // the request was successful, error will be null.
      function (error) {
        if (error) {
          // Display error message to user. Add HTML content to the HTML element
          // with id errorMessage
          $("#errorMessage").html("Whoops! There was a problem saving this recommendation.");
        } else {
          // Clear any error messages that might be displayed and clear all the
          // form inputs so that the user can enter a new recommendation
          $("#errorMessage").empty();
          $("#recommendationForm input").val('');
        }
      }
    );
  };

  // Return the a formatted string with the user name to display.
  // If twitter data is available, use twitter name. Otherwise,
  // assume submitter is anonymous.
  var getSubmitterName = function (twitter) {
    if (twitter) {
      return twitter.displayName + " (@" + twitter.username + ")";
    } else {
      return "anonymous";
    }
  }

  // Update the submitter name displayed in the HTML form using
  // the twitter name of the authorized user.
  var updateTwitterName = function (authData) {
    $("#talkUser").html(getSubmitterName(authData.twitter));
  }

  // Add a new recommendation to the recommendations table, and remove any
  // extra rows so that a constant number of rows are shown.
  var addRecommendationRow = function (recommendation) {
    // Build the HTML string that represents this new row and the data it shows
    var html = "<tr>\
      <td>" + recommendation.title + "</td>\
      <td>" + recommendation.presenter + "</td>\
      <td><a id='link' target='_blank' href='" + recommendation.link + "'>" + recommendation.link + "</a></td>\
      <td>" + getSubmitterName(recommendation.twitter) + "</td>\
    </tr>";

    // Add the new HTML to the end of the table body
    $("#recommendations").append(html);

    // If there are more rows than there should be, remove extras from the top
    // of the table (these are the oldest recommendations).
    while ($("#recommendations tr").length > 3) {
      $("#recommendations tr").first().remove();
    }
  };

  // Perform any tasks that should only be run once, the first time the
  // website is loaded.
  var initialize = function () {

    // Get data about the currently authorized user, if any exists
    var authData = Database.getAuthData();

    if (authData) {
      // There is an authorized user already
      if (authData.twitter) {
        // The user has authorized using Twitter. Update the submitter name
        // in the recommendations form to reflect this.
        updateTwitterName(authData);
      }
    } else {
      // There is no authorized user. Automatically authorize them anonymously
      // so that they can still submit recommendations.
      Database.authAnonymously();
    }

    // Add a listener to Firebase so that when a new recommendation is added,
    // this callback function is called.
    Database.getMostRecentRecommendation(function (recommendation) {
      // Add this recommendation to the recommendations table.
      addRecommendationRow(recommendation);
    });

    // Find the HTML element with the id submitButton, and when the button is
    // clicked, call the submitRecommendation function.
    $("#submitButton").click(submitRecommendation);

    // Find the HTML element with the id authTwitter, and when the button is
    // clicked, call this callback function.
    $("#authTwitter").click(function () {
      // Authorize this app using Twitter, and when the user has successfully
      // authorized with Twitter, call this callback function with the auth
      // data object as the first argument.
      Database.authTwitter(function (authData) {
        // Update the twitter name shown on the recommendation submission form.
        updateTwitterName(authData);
      });
    });

    // Find all HTML elements with the class btn, and when a mouse (or touch)
    // event is finished, call this callback function.
    $(".btn").mouseup(function(){
      // Blur the element that triggered this event. This means that when a user
      // is done clicking the button, it will lose focus and look like it hasn't
      // been clicked. Total style move only, but it makes the button behave
      // the way most people expect it to behave.
      $(this).blur();
    });
  };

  // Run the initialize function.
  initialize();

});