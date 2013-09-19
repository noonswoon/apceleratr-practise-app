// a couple local variables to save state
var currentUser = null;
var loggedIn = false;

exports.isLoggedIn = function() {
	return loggedIn;
};


exports.getUserId = function() {
	return Ti.App.Properties.getString("userId");
};

function getUserFbId() {
	return Ti.App.Properties.getString("userFbId");
};
exports.getUserFbId = getUserFbId; 

exports.getUserFbToken = function() {
	return Ti.App.Properties.getString("userFbToken");
};

exports.setUserId = function() {
	Ti.App.Properties.setString("userId", myUserId);
};
exports.getUserFbId = getUserFbId; 

exports.setUserFbId = function() {
	Ti.App.Properties.setString("userFbId", myUserFbId);
};
exports.getUserFbId = getUserFbId; 

exports.setUserFbToken = function() {
	Ti.App.Properties.setString("userFbToken", myUserFbToken);
};
exports.getUserFbId = getUserFbId; 


exports.getUserImage = function() {
	var fbId = getUserFbId(); 
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture";
};

exports.getUserImageSquareOfFbId = function(fbId) {
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=square";
};

exports.getUserImageNormalOfFbId = function(fbId) {
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=normal";
};

exports.getUserImageLarge = function() {
	var fbId = getUserFbId(); 
	if(fbId === -1 || fbId === 0 || fbId === "0") return "";
	else return "https://graph.facebook.com/"+fbId+"/picture?type=large";
};

exports.shuffleArray = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};	


