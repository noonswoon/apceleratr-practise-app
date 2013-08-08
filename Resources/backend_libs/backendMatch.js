/**
 * @author Mickey Asavanant
 */

exports.getLatestMatchInfo = function(_userId, _callbackFn) {
	var fnSrc = 'backendMatch.getLatestMatchInfo';
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
					var paramObj = {};
					paramObj.success = false;
					paramObj.hasNoMatch = false;
					if(resultObj.meta !== undefined  && resultObj.meta.status === "error") {
						if(resultObj.meta.status_code === 501) {
							Ti.App.fireEvent('openNoMatchWindow');
							paramObj.hasNoMatch = true;
						} else { //some other error code..legit error
							Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:resultObj.meta.string_to_display, description:resultObj.meta.description}});
						}
					} else {
						Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					}
					_callbackFn(paramObj);
				}
	        },
	        onerror : function(e) {
	            //no more error message..fail silently
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
	var fnSrc = 'backendMatch.getMatchInfo';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "match/get/"+_paramObj.matchId+"/"+_paramObj.userId;
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined  && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					if(resultObj.meta !== undefined  && resultObj.meta.status === "error") {
						if(resultObj.meta.status_code === 501) {
							Ti.App.fireEvent('openNoMatchWindow');
						} else { //some other error code..legit error
							Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:resultObj.meta.string_to_display, description:resultObj.meta.description}});
						}
					} else {
						Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _paramObj.userId, null);
					}
					_callbackFn({success:false});
				}
	        },
	        onerror : function(e) {
	        	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _paramObj.userId, null);
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
	var fnSrc = 'backendMatch.saveResponse';
	var sendingObj = {};
	sendingObj.match_id = _matchResponseObj.matchId; 
	sendingObj.response = _matchResponseObj.response;
	sendingObj.user_id = _matchResponseObj.userId; 
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"match/save_response/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
		      		resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _matchResponseObj.userId, null);
					resultObj.success = false;
					_callbackFn(resultObj);
				}
		    },
		    onerror: function(e) {		    
		    	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _matchResponseObj.userId, null);
	            _callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
	   	var hashVal = Ti.Utils.sha256(sendingObj.match_id + sendingObj.response + sendingObj.user_id + Ti.App.NS_HASH_SECRET_KEY);
	    xhr.setRequestHeader('NsHashKey',hashVal);
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};

exports.updateDisplayMutualFriend = function(_matchUserObj, _callbackFn) {
	var fnSrc = 'backendMatch.updateDisplayMutualFriend';
	var sendingObj = {};
	sendingObj.match_id = _matchUserObj.matchId; 
	sendingObj.user_id = _matchUserObj.userId;

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"match/update_display_mutual_friend/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _matchUserObj.userId, null);
					resultObj.success = false;
					_callbackFn(resultObj);
				}
		    },
		    onerror: function(e) {
	        	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _matchUserObj.userId, null);
	            _callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open("PUT", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
	   	var hashVal = Ti.Utils.sha256(sendingObj.match_id + sendingObj.user_id + Ti.App.NS_HASH_SECRET_KEY);
	    xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};

exports.getConnectedMatch = function(_userId, _callbackFn) {
	var fnSrc = 'backendMatch.getConnectedMatch';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER+ "match/get_connected_match/"+_userId;
		//Ti.API.info('getMatchInfo api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
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
	    xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	    xhr.setRequestHeader('Content-Type','application/json');
	    var hashVal = Ti.Utils.sha256(url + Ti.App.NS_HASH_SECRET_KEY);
	    xhr.setRequestHeader('NsHashKey',hashVal);
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
	var fnSrc = 'backendMatch.deleteConnectedMatch';
	var sendingObj = {}; 
	sendingObj.match_id = _matchObj.matchId;
	sendingObj.user_id = _matchObj.userId;
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
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _matchObj.userId, null);
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _matchObj.userId, null);
	            _callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open('POST', url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.match_id + sendingObj.user_id + Ti.App.NS_HASH_SECRET_KEY);
	    xhr.setRequestHeader('NsHashKey',hashVal);	 		 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};

exports.isLatestMatchConnected = function() {
	
	if(!Ti.App.Properties.hasProperty('currentMatchConnectedTime')) {
		//Ti.API.info('V have not had data..never connected');
		return false;
	} 
	
	var currentMatchConnectedTimeStr = Ti.App.Properties.getString('currentMatchConnectedTime');
	var currentMatchConnectedTime = Ti.App.moment(currentMatchConnectedTimeStr,"YYYY-MM-DDTHH:mm:ss");
	var currentMatchConnectedDay = Ti.App.moment(currentMatchConnectedTime.year()+"-"+currentMatchConnectedTime.month()+"-"+currentMatchConnectedTime.date()+"T00:00:01", "YYYY-MM-DDTHH:mm:ss");
	var currentMatchConnectedHour = currentMatchConnectedTime.hours();
	
	//Ti.API.info('currentMatchConnectedTimeStr: ' + currentMatchConnectedTimeStr);
	//Ti.API.info('currentMatchConnectedHour: '+currentMatchConnectedHour);
	
	var momentObj = Ti.App.moment(); 
	var todayObj = Ti.App.moment(momentObj.year()+"-"+momentObj.month()+"-"+momentObj.date()+"T00:00:01", "YYYY-MM-DDTHH:mm:ss");
	
	//compare today noon with current time
	var curHour = momentObj.hours(); 
	var currentTimeAlreadyPassNoon = false;
	if(curHour >= 12) {
		//already passed noon, 
		currentTimeAlreadyPassNoon = true;
	}
	
	var daysDiff = todayObj.diff(currentMatchConnectedDay, 'days'); //if it is same day, daysDiff = 0
	//Ti.API.info('daysDiff: '+daysDiff);
	if(daysDiff === 0) { //same day scenario
		if(currentTimeAlreadyPassNoon) { //current time already passed noon
			if(currentMatchConnectedHour < 12) { //last pull is before noon, need to pull again, did NOT have the latest match yet
				//Ti.API.info('V same day, current time already pass noon, last fetch is before noon..isLatestMatch: false');
				return false;
			} else {
				//Ti.API.info('V same day, current time already pass noon, last fetch is after noon..isLatestMatch: true');
				return true;
			}
		} else {
			//Ti.API.info('V same day, current time NOT YET pass noon, last fetch can be anytime..isLatestMatch: true');
			return true; //same day and current time hasn't reach noon yet, last pull is already the latest one
		}
	} else { //last fetch of match is some days in the past (can be yesterday or a week ago)
		//Ti.API.info('daysDiff is: '+daysDiff);
		if(daysDiff > 1) { //different for more than 1 day, does not have the latetst match for sure
			//Ti.API.info('V different day, daysDiff: '+daysDiff+ ' ..isLatestMatch: false');
			return false;
		} else {
			if(currentMatchConnectedHour < 12)  { //last pull was before noon from yesterday--> does not have the latest match which came yesterday at noon
				//Ti.API.info('V yesterday, last fetch is before noon..isLatestMatch: false');
				return false;
			} else { //last pull was after 12 on yesterday
				if(currentTimeAlreadyPassNoon) { //now is after 12, so does not have the connected match since the latest one is noon today
					//Ti.API.info('V yesterday, last fetch is after noon, current time already pass noon..isLatestMatch: false');
					return false;
				} else { //now is before 12, and last time fetch is after noon yesterday, so current have the latest match
					//Ti.API.info('V yesterday, last fetch is after noon, current time is before noon..isLatestMatch: true');
					return true;
				}
			}
		}
	}
};

exports.setCurrentMatchConnected = function() {
	//var nowStr = Ti.App.moment("2013-07-04T15:45:24", "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DDTHH:mm:ss"); --testing purposes 
	var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss");
	Ti.App.Properties.setString('currentMatchConnectedTime',nowStr);
}
