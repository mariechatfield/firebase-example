define(["firebase"], function (Firebase) {

  var myFirebaseApp = "talksyoushouldwatch";

  // Reference to the recommendations object in your Firebase
  var recommendations = new Firebase("https://" + myFirebaseApp + ".firebaseio.com/recommendations");

  var saveRecommendation = function (recommendation) {
    recommendations.push(recommendation);
  };

  var getMostRecentRecommendation = function (callback) {
    recommendations.limitToLast(1).on('child_added', function(childSnapshot) {
      // Get the recommendation data from the most recent snapshot of data
      // added to the recommendations list in Firebase
      recommendation = childSnapshot.val();
      callback(recommendation);
    });
  };

  return {
    saveRecommendation: saveRecommendation,
    getMostRecentRecommendation: getMostRecentRecommendation
  };

});