define(["firebase"], function (Firebase) {

  var myFirebaseApp = "talksyoushouldwatch";

  // Reference to the recommendations object in your Firebase
  var recommendations = new Firebase("https://" + myFirebaseApp + ".firebaseio.com/recommendations");

  var authentication = {};

  var getAuthData = function () {
    return authentication;
  };

  var saveRecommendation = function (recommendation, callback) {
    recommendations.push(recommendation, callback);
  };

  var getMostRecentRecommendation = function (callback) {
    recommendations.limitToLast(1).on('child_added', function(childSnapshot) {
      // Get the recommendation data from the most recent snapshot of data
      // added to the recommendations list in Firebase
      recommendation = childSnapshot.val();
      callback(recommendation);
    });
  };

  var authAnonymously = function () {
    recommendations.authAnonymously(function(error, authData) {
      if (error) {
        console.log("Authentication Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        authentication = authData;
      }
    });
  };

  var authTwitter = function () {
    recommendations.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        authentication = authData;
      }
    });
  };

  return {
    saveRecommendation: saveRecommendation,
    getMostRecentRecommendation: getMostRecentRecommendation,
    authAnonymously: authAnonymously,
    authTwitter: authTwitter,
    getAuthData: getAuthData
  };

});