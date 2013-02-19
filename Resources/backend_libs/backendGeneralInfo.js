/**
 * @author Mickey Asavanant
 */

////////////////// START REAL-CODE /////////////////////////////
exports.getReligion = function(_callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"religion_data/";
		//Ti.API.info('getReligion url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					alert("something wrong with ServerCall backendGeneralInfo.getReligion");
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        alert("in getReligion, onerror"+JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/religion_data.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj.content);
		} else {
			Ti.API.error("something wrong with backendGeneralInfo.getReligion")
		}
	}
};

exports.getEthnicity = function(_callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"ethnicity_data/";
		//Ti.API.info('getEthnicity url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					alert("something wrong with ServerCall backendGeneralInfo.getReligion");
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        alert("in getReligion, onerror"+JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/ethnicity_data.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj.content);
		} else {
			Ti.API.error("something wrong with backendGeneralInfo.getEthnicity")
		}
	}
};

exports.getTargetedCity = function(_callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"targeted_city_data/";
		//Ti.API.info('getTargetedCity url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					alert("something wrong with ServerCall backendGeneralInfo.getTargetedCity");
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        alert("in getTargetedCity, onerror"+JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/targeted_city_data.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			Ti.API.info('done calling getTargetedCity..');
			_callbackFn(resultObj.content);
		} else {
			Ti.API.error("something wrong with backendGeneralInfo.getTargetedCity")
		}
	}
};

exports.getStaticData = function(_callbackFn) {
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"get_static_data/";
		//Ti.API.info('getStaticData url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					alert("something wrong with ServerCall backendGeneralInfo.getStaticData");
					Ti.App.fireEvent('openErrorWindow', {description: 'backendGeneralInfo.getStaticData, server error: ' + resultObj.meta.description});
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        alert("in getStaticData, onerror"+JSON.stringify(e));
		        Ti.App.fireEvent('openErrorWindow', {description: 'backendGeneralInfo.getStaticData, network error'});
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/static_data.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj.content);
		} else {
			Ti.API.error("something wrong with backendGeneralInfo.getStaticData")
		}
	}
};
