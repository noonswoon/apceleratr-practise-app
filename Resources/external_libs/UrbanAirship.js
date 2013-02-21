var APP_STORE_OR_AD_HOC_BUILD = true;
var URBAN_AIRSHIP_APP_DEV_KEY = "-iH8x1gCSA-myDRSkHtW1A";
var URBAN_AIRSHIP_APP_DEV_SECRET = "aRdpicLSSSuGFMJWGUGTaw";
var URBAN_AIRSHIP_APP_PROD_KEY = "y3en0sTuREKQlFvB6Lop0A";
var URBAN_AIRSHIP_APP_PROD_SECRET = "FTsofROESraMdFuLY-x0RQ";
var MY_DEVICE_TOKEN_SYM = 'myDeviceToken';

var getDeviceToken = function() {
	if(!Ti.App.IS_ON_DEVICE)
		return "82DFA37CD520A0CBF2EF92A2138550AE88829C08EC01DE2109FE61FC3ADE82D5";
	else {
		var deviceToken = "";
		if(Ti.App.Properties.hasProperty(MY_DEVICE_TOKEN_SYM)) {
			deviceToken =  Ti.App.Properties.getString(MY_DEVICE_TOKEN_SYM);
		}
		return deviceToken;
	}
};
exports.getDeviceToken = getDeviceToken;

var setDeviceToken = function(_deviceToken) {
	Ti.App.Properties.setString(MY_DEVICE_TOKEN_SYM,_deviceToken.toUpperCase());
};
exports.setDeviceToken = setDeviceToken;

var getAppKey = function() {
	var appKey = "";
	if(APP_STORE_OR_AD_HOC_BUILD)  appKey = URBAN_AIRSHIP_APP_PROD_KEY;
	else appKey = URBAN_AIRSHIP_APP_DEV_KEY;
	//alert('appKey: '+appKey);
	return appKey;
}
exports.getAppKey = getAppKey;

var getAppSecret = function() {
	var appSecret = "";
	if(APP_STORE_OR_AD_HOC_BUILD)  appSecret = URBAN_AIRSHIP_APP_PROD_SECRET;
	else appSecret = URBAN_AIRSHIP_APP_DEV_SECRET;
	return appSecret;
};
exports.getAppSecret = getAppSecret;

var registerDeviceToken = function(_deviceToken) {
	setDeviceToken(_deviceToken);
	var xhr = Titanium.Network.createHTTPClient({
		onload:function(e) {
			if (xhr.status != 200 && xhr.status != 201) {
				xhr.onerror(e);
				return;
			}
		},
		onerror:function(e) {
			debug_print("Register with Urban Airship Push Service failed. Error: " + e.error);
		}
	}); 
	
	// Register device token with UA
	xhr.open('PUT', 'https://go.urbanairship.com/api/device_tokens/' + _deviceToken, true);
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(getAppKey() + ':' + getAppSecret()));
	
	var registerParameters = {
	    "tags": [
	        "v0_1",
	        "beta"
	    ],
	    "badge": 0,
	    // "quiettime": {
	        // "start": "6:00",
	        // "end": "7:00"
	    // },
	    // "tz": "Asia/Bangkok"
	};
	xhr.send(JSON.stringify(registerParameters));
};
exports.registerDeviceToken = registerDeviceToken;

exports.resetBadge = function(_deviceToken) {
	registerDeviceToken(_deviceToken);
};

exports.unRegisterDeviceToken = function() {
	var request = Titanium.Network.createHTTPClient({
			onerror:function(e) {
				debug_print("ERROR: deleted device token data with Urban Airship Push Service failed. Error: "
	                + e.error);
	        }
	    });
	request.open('DELETE', 'https://go.urbanairship.com/api/device_tokens/'+getDeviceToken(), true);
    request.setRequestHeader('Authorization','Basic '  + Titanium.Utils.base64encode(getAppKey() + ':' + getAppSecret()));
    request.send();
}
