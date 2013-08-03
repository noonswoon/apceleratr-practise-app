/**
 * @author Mickey Asavanant
 */

////////////////// START REAL-CODE /////////////////////////////
exports.getReligion = function(_callbackFn) {
	var fnSrc = 'backendGeneralInfo.getReligion';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"religion_data/";
		//Ti.API.info('getReligion url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), null, null);
				}
		    },
		    onerror: function(e) {
		    	_callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error', null, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
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
	var fnSrc = 'backendGeneralInfo.getEthnicity';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"ethnicity_data/";
		//Ti.API.info('getEthnicity url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), null, null);
				}
		    },
		    onerror: function(e) {
		    	_callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error', null, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
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
	var fnSrc = 'backendGeneralInfo.getTargetedCity';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"targeted_city_data/";
		//Ti.API.info('getTargetedCity url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});	
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), null, null);
				}
		    },
		    onerror: function(e) {
		    	_callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error', null, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
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
	var fnSrc = 'backendGeneralInfo.getStaticData';
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"get_static_data/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
				if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), null, null);
				}
		    },
		    onerror: function(e) {
		    	_callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error', null, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
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
