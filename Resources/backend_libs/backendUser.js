/**
 * @author Mickey Asavanant
 */
exports.saveEditUserInfo = function(_userId, _editObj, _callbackFn) {
	var fnSrc = 'backendUser.saveEditUserInfo';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/edit/"+_userId;
		var xhr = Ti.Network.createHTTPClient({
	        onload : function(e) {
	        	//Ti.API.info('saveEditUserInfo: '+this.responseText);
	        	var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					_callbackFn({success:false});
				}
	        },
	        onerror : function(e) {
	            Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
	        	_callbackFn({success:false});
	        },
		    timeout:50000  // in milliseconds 
	    });
		xhr.setValidatesSecureCertificate(false);
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(_userId + url + Ti.App.NS_HASH_SECRET_KEY);		
		xhr.setRequestHeader('NsHashKey',hashVal);
	    xhr.send(_editObj); 
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_edit_result.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			//Ti.API.info('userInfo: '+JSON.stringify(resultObj));
			setTimeout(_callbackFn, 5000);
		} else {
			Ti.API.error("something wrong with backendUser.saveEditUserInfo")
		}
	}
};

exports.connectToServer = function(_userObj, _callbackFn) {
	var fnSrc = 'backendUser.connectToServer';
	var sendingObj = {};
	sendingObj.client_version = Ti.App.CLIENT_VERSION;
	sendingObj.device_id = _userObj.deviceId;
	sendingObj.device_platform = 'iphone'; 
	sendingObj.fb_auth_token = Ti.App.Facebook.accessToken; 
	sendingObj.latitude = Ti.App.Properties.getDouble('latitude');
	sendingObj.longitude = Ti.App.Properties.getDouble('longitude');
	sendingObj.mac_addr =  Ti.Platform.id;
	sendingObj.user_fb_id = Ti.App.Facebook.uid;
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"userasync/connect_server";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
	        	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
	        	_callbackFn({success:false});		
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
	 	
		var hashVal = Ti.Utils.sha256(sendingObj.user_fb_id + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_login_result.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			Ti.API.info('userStuff..:'+resultObj.content.user_status);
			_callbackFn(resultObj);
		} else {
			Ti.API.error("something wrong with backendUser.connectToServer")
		}		
	}
};

exports.getUserInfo = function(_userId, _callbackFn) {
	var fnSrc = 'backendUser.getUserInfo';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"user/id/"+_userId;
		//Ti.API.info('getUserInfo url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
		    	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
		    	_callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_obj.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			//Ti.API.info('userInfo: '+JSON.stringify(resultObj));
			_callbackFn(resultObj);
		} else {
			Ti.API.error("something wrong with backendUser.getUserInfo")
		}		
	}	
};

exports.getUserIdFromFbId = function(_fbId, _callbackFn) {
	var fnSrc = 'backendUser.getUserIdFromFbId';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"user/fb_id/"+_fbId;
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
		    		resultObj.success = true;
					_callbackFn(resultObj);
				} else if(resultObj.meta !== undefined  && resultObj.meta.status === "error") {
					//case of no user with Facebook id xxxx
					Ti.App.Facebook.logout();
					_callbackFn({success:false});
					//Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:resultObj.meta.string_to_display, description:resultObj.meta.description}});
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), null, _fbId);
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), null, _fbId);
		    	_callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		
		xhr.setValidatesSecureCertificate(false);
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_id_obj.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			//Ti.API.info('userInfo: '+JSON.stringify(resultObj));
			_callbackFn(parseInt(resultObj.meta.user_id));
		} else {
			Ti.API.error("something wrong with backendUser.getUserIdFromFbId")
		}		
	}	
};

exports.saveUserReport = function(_reportObj, _callbackFn) {
	var fnSrc = 'backendUser.saveUserReport';
	var sendingObj = {};
	sendingObj.reason = _reportObj.reason; 
	sendingObj.targeted_user_id = _reportObj.targetedUserId;
	sendingObj.user_id = _reportObj.userId; 

	//Ti.API.info('saveUserReport: '+JSON.stringify(sendingObj));	

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/report/";
		//Ti.API.info('edit api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {				
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _reportObj.userId, null);
					_callbackFn({success:false});
				}
	        },
	        onerror : function(e) {
	       	    Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
		    	_callbackFn({success:false});			 
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.setValidatesSecureCertificate(false);
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.user_id + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	    
	   	xhr.send(JSON.stringify(sendingObj));
	}
};

exports.updatePNToken = function(_userId, _pnToken, _callbackFn) {
	var fnSrc = 'backendUser.updatePNToken';
	var sendingObj = {};

	sendingObj.device_platform = 'iphone';
	sendingObj.pn_token = _pnToken;
	sendingObj.user_id = _userId; 
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/update_pn_token/";
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					_callbackFn({success:false});
				}
	        },
	        onerror : function(e) {
	       	   	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
		    	_callbackFn({success:false});	 
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.setValidatesSecureCertificate(false);
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.user_id + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);
	   	xhr.send(JSON.stringify(sendingObj));
	}
};

exports.updateClientVersion = function(_userId, _callbackFn) {
	var fnSrc = 'backendUser.updateClientVersion';
	var sendingObj = {};
	sendingObj.client_version = Ti.App.CLIENT_VERSION;
	sendingObj.device_platform = 'iphone';
	sendingObj.user_id = _userId; 
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/update_client_version/";
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					_callbackFn({success:false});
				}
	        },
	        onerror : function(e) {
	       	   	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
		    	_callbackFn({success:false});	 
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.setValidatesSecureCertificate(false);
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.user_id + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	    
	   	xhr.send(JSON.stringify(sendingObj));
	}
};
