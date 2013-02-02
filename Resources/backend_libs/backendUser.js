/**
 * @author Mickey Asavanant
 */
exports.saveEditUserInfo = function(_userId, _editObj, _callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/edit/"+_userId;
		Ti.API.info('edit api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
	        onload : function(e) {
	        	Ti.API.info('saveEditUserInfo: '+this.responseText);
	        	var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					resultObj.success = false;
					alert("something wrong with ServerCall backendGeneralInfo.getReligion");
				}
	        },
	        onerror : function(e) {
	            Ti.API.info('Network Connection Error. ' + JSON.stringify(e));
	            _callbackFn({success:false}); //change here
	        },
		    timeout:50000  // in milliseconds 
	    });
	
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	    Ti.API.info('sending edit data to server: '+JSON.stringify(_editObj));
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
	var sendingObj = {};
	sendingObj.user_fb_id = _userObj.userFbId; 
	sendingObj.fb_auth_token = _userObj.fbAuthToken; 
	sendingObj.device_platform = _userObj.devicePlatform;
	sendingObj.device_id = _userObj.deviceId;
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"userasync/connect_server";
		Ti.API.info('sending to connect to server');
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	Ti.API.info('success connect_to_server: '+JSON.stringify(resultObj));
		      	_callbackFn(resultObj);
		      	//get the user session ? may be no need to
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in user_connectToServer..server NOT ready yet");
		        Ti.API.info(JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
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
	if(false) {
	//if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"user/id/"+_userId;
		Ti.API.info('getUserInfo url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	Ti.API.info('getUserInfo: '+this.responseText);
		    	_callbackFn(JSON.parse(this.responseText));
		      	//get the user session ? may be no need to
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in getUserInfo ..server NOT ready yet");
		        Ti.API.info(JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
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
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"user/fb_id/"+_fbId;
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					//Ti.API.info('userInfoFromFbId: '+JSON.stringify(resultObj));
					_callbackFn(resultObj);
				} else {
					Ti.API.info('Error getUserIdFromFbId: '+ JSON.stringify(resultObj));
					//need to send them back to the login page --> fire an event
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in getUserIdFromFbId ..server NOT ready yet");
		        Ti.API.info(JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_id_obj.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			//Ti.API.info('userInfo: '+JSON.stringify(resultObj));
			_callbackFn(resultObj.meta.user_id);
		} else {
			Ti.API.error("something wrong with backendUser.getUserIdFromFbId")
		}		
	}	
};

exports.saveUserReport = function(_reportObj, _callbackFn) {
	var sendingObj = {};
	sendingObj.user_id = _reportObj.userId; 
	sendingObj.targeted_user_id = _reportObj.targetedUserId;
	sendingObj.reason = _reportObj.reason; 
	Ti.API.info('saveUserReport: '+JSON.stringify(sendingObj));	

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "user/report/";
		Ti.API.info('edit api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					_callbackFn({success:false});
					alert("something wrong with ServerCall backendUser.saveUserReport");
				}
	        },
	        onerror : function(e) {
	            Ti.API.info('Network Connection Error. ' + JSON.stringify(e));
	            _callbackFn({success:false}); //change here
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("POST", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	   	xhr.send(JSON.stringify(sendingObj));
	}
};
