require.config({
  paths: {
    jquery: "https://code.jquery.com/jquery-2.2.0.min",
    firebase: "https://cdn.firebase.com/js/client/2.4.0/firebase"
  },
  shim: {
    'firebase': {
      exports: 'Firebase'
    }
  }
})

require(["jquery", "database"], function ($, Database) {
  // Save a new recommendation to the database, using the input in the form
  var submitRecommendation = function () {
    // Get input values from each of the form elements
    var title = $("#talkTitle").val();
    var presenter = $("#talkPresenter").val();
    var link = $("#talkLink").val();

    // Get unique user id from authenticated user
    var authData = Database.getAuthData();
    var uid = authData.uid;

    var twitter = {};

    if (authData.twitter != null) {
      twitter.username = authData.twitter.username;
      twitter.displayName = authData.twitter.displayName;
    }

    // Push a new recommendation to the database using those values
    Database.saveRecommendation({
      "title": title,
      "presenter": presenter,
      "link": link,
      "uid": uid,
      "twitter": twitter
    }, function (error) {
      if (error) {
        $("#errorMessage").html("Whoops! There was a problem saving this recommendation.");
      } else {
        $("#errorMessage").empty();
        $("#recommendationForm input").val('');
      }
    });
  };

  Database.authTwitter();

  // Get the single most recent recommendation from the database and
  // update the table with its values. This is called every time the child_added
  // event is triggered on the recommendations Firebase reference, which means
  // that this will update EVEN IF you don't refresh the page. Magic.
  Database.getMostRecentRecommendation(function (recommendation) {
    // Update the HTML to display the recommendation text
    $("#title").html(recommendation.title)
    $("#presenter").html(recommendation.presenter)
    $("#link").html(recommendation.link)

    // Make the link actually work and direct to the URL provided
    $("#link").attr("href", recommendation.link)
  });

  // Find the HTML element with the id recommendationForm, and when the submit
  // event is triggered on that element, call submitRecommendation.
  $("#submitButton").click(submitRecommendation);

  $("#submitButton").mouseup(function(){
      $(this).blur();
  });
});