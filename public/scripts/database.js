define(["firebase"], function (Firebase) {

  var myFirebaseApp = "talksyoushouldwatch";

  // Reference to the recommendations object in your Firebase
  var recommendations = new Firebase("https://" + myFirebaseApp + ".firebaseio.com/recommendations");

  var getAuthData = function () {
    return recommendations.getAuth();
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
      }
    });
  };

  var authTwitter = function (callback) {
    recommendations.authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
        authAnonymously();
      } else {
        console.log("Authenticated successfully with payload:", authData);
        callback(authData);
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