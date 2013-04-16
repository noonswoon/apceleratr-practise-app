/**
 * @author Mickey Asavanant
 */

exports.getLatestMatchInfo = function(_userId, _callbackFn) {
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "match/get_latest/"+_userId;
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined  && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					resultObj.success = false;
					if(resultObj.meta !== undefined  && resultObj.meta.status === "error") {
						if(resultObj.meta.status_code === 501) {
							Ti.App.fireEvent('openNoMatchWindow');
						} else {
							Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getLatestMatchInfo', meta:resultObj.meta});
						}
					} else {
						Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getLatestMatchInfo', meta:{display_error:'Application Error|delete and install again'}});
					}
					_callbackFn(resultObj);
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getLatestMatchInfo', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/match_info_obj.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		_callbackFn(resultObj);
	}	
};

exports.getMatchInfo = function(_paramObj, _callbackFn) { //test stuff here for matchChat page
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "match/get/"+_paramObj.matchId+"/"+_paramObj.userId;
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined  && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					resultObj.success = false;
					if(resultObj.meta !== undefined  && resultObj.meta.status === "error") {
						if(resultObj.meta.status_code === 501) {
							Ti.App.fireEvent('openNoMatchWindow');
						} else {
							Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getMatchInfo', meta:resultObj.meta});
						}
					} else {
						Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getMatchInfo', meta:{display_error:'Application Error|delete and install again'}});
					}
					_callbackFn(resultObj);
				}
	        },
	        onerror : function(e) {
	        	_callbackFn({success:false});
	        	Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getMatchInfo', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
	    xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/match_info_obj.txt');
		var contents = f.read();
		//Ti.API.info('contents text: '+contents.text);
		var resultObj = JSON.parse(contents.text); 
		_callbackFn(resultObj);
	}
};


exports.saveResponse = function(_matchResponseObj, _callbackFn) {
	var sendingObj = {};
	sendingObj.match_id = _matchResponseObj.matchId; 
	sendingObj.user_id = _matchResponseObj.userId; 
	sendingObj.response = _matchResponseObj.response;
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"match/save_response/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.saveResponse', meta:resultObj.meta});
				}
		    },
		    onerror: function(e) {
		        _callbackFn({success:false});
		    	Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.saveResponse', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};

exports.updateDisplayMutualFriend = function(_matchUserObj, _callbackFn) {
	var sendingObj = {};
	sendingObj.match_id = _matchUserObj.matchId; 
	sendingObj.user_id = _matchUserObj.userId;
	//Ti.API.info('sendingObj updateDisplayMutualFriend: '+JSON.stringify(sendingObj));

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"match/update_display_mutual_friend/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.updateDisplayMutualFriend', meta:resultObj.meta});
				}
		    },
		    onerror: function(e) {
		        _callbackFn({success:false});
		    	Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.updateDisplayMutualFriend', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("PUT", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};

exports.getConnectedMatch = function(_userId, _callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "match/get_connected_match/"+_userId;
		//Ti.API.info('getMatchInfo api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj);
				} else {
					Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getConnectedMatch', meta:resultObj.meta});
				}
	        },
	        onerror : function(e) {
	        	Ti.App.fireEvent('openErrorWindow', {src: 'backendMatch.getConnectedMatch', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/connected_match_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj);
		} else {
			Ti.API.error("something wrong with backendMatch.getConnectedMatch")
		}	
	}	
};

exports.deleteConnectedMatch = function(_matchObj, _callbackFn) {
	var sendingObj = {}; 
	sendingObj.match_id = _matchObj.matchId;
	sendingObj.user_id = _matchObj.userId
	//Ti.API.info('sending this obj to flag as delete at server: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"match/delete_connected_match/";
		//Ti.API.info('url for delete: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					Ti.API.info('Error backendMatch.deleteConnectedMatch: '+ JSON.stringify(resultObj));
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in backendMatch.deleteConnectedMatch ..server NOT ready yet");
		        _callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open('POST', url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};