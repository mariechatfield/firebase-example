// Define a module to be used by require.js. When other scripts require this
// script, they will only have access to the object that this callback function
// returns. Before running this callback function, load the Firebase library,
// (using the config options in application.js). So any script which depends on
// this module to load must also wait for Firebase to load.
define(["firebase"], function (Firebase) {

  // Unique Firebase app name -- REPLACE THIS WITH YOUR APP NAME IF YOU WANT
  // TO FORK THIS REPO!
  var myFirebaseApp = "talksyoushouldwatch";

  // Reference to our entire Firebase database
  var firebaseApp = new Firebase("https://" + myFirebaseApp + ".firebaseio.com");

  // Reference to the recommendations object in our Firebase database
  var recommendations = firebaseApp.child("recommendations");

  // Return the authentication data being used by this app to access our
  // database. If the user has not yet authenticated, this will be null.
  var getAuthData = function () {
    return firebaseApp.getAuth();
  };

  // Add a new object to the recommendations object in our database, and assign
  // it a unique key. When the request to the server completes, call the
  // function that was passed in as the callback argument.
  var saveRecommendation = function (recommendation, callback) {
    recommendations.push(recommendation, callback);
  };

  // Get the most recent recommendations, one by one. When each one is loaded,
  // call the callback function with the recommendation data as its first
  // argument.
  var getMostRecentRecommendation = function (callback) {
    // Add an event listener to the recommendations reference. Whenever the
    // child_added event is triggered, call this callback function and pass it
    // the available data about the child data object that has just been added.
    // Limit this query to only the last three recommendations at any given
    // time.
    recommendations.limitToLast(3).on('child_added', function(childSnapshot) {
      // Get the recommendation data from the most recent snapshot of data
      // added to the recommendations list in Firebase
      recommendation = childSnapshot.val();

      // Call the provided callback function with the recommendation data as
      // its first argument.
      callback(recommendation);
    });
  };

  // Authenticate access to our Firebase database as an anonymous user.
  var authAnonymously = function () {
    firebaseApp.authAnonymously(function(error, authData) {
      if (error) {
        // If the request to authenticate failed, log the error the browser's
        // console.
        console.log("Authentication Failed!", error);
      } else {
        // If the request to authenticate was successful, log the authentication
        // data to the console.
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  };

  // Authenticate access to our Firebase database using Twitter, and call the
  // callback function with the authentication data if the request was
  // successful. This will prompt the user to sign in with their Twitter account
  // and give our Firebase application access to their account.
  var authTwitter = function (callback) {
    firebaseApp.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        // If the request to authenticate failed, log the error the browser's
        // console and attempt to authenticate anonymously.
        console.log("Login Failed!", error);
        authAnonymously();
      } else {
        // If the request to authenticate was successful, log the authentication
        // data to the console and call the provided callback function with
        // the authentication data as its first argument.
        console.log("Authenticated successfully with payload:", authData);
        callback(authData);
      }
    });
  };

  // Return an object, which other scripts can reference if they require this
  // script using require.js. If variables or functions are not included in
  // this object, other scripts will NOT have access to them.
  return {
    saveRecommendation: saveRecommendation,
    getMostRecentRecommendation: getMostRecentRecommendation,
    authAnonymously: authAnonymously,
    authTwitter: authTwitter,
    getAuthData: getAuthData
  };

});