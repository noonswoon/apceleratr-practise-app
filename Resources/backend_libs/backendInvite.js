/**
 * @author Mickey Asavanant
 */

exports.getInvitedList = function(_userId, _callbackFn) {
	var fnSrc = 'backendInvite.getInvitedList';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"invite/get_invited_people/"+_userId;
		//Ti.API.info('getInvitedList url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
				}
		    },
		    onerror: function(e) {
		        _callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + 'onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
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
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/invited_list_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			var invitedList = resultObj.content.invited_people; 
			//Ti.API.info(JSON.stringify(invitedList));	
			_callbackFn(invitedList);
		} else {
			Ti.API.error("something wrong with backendInvite.getInvitedList")
		}
	}
};

exports.saveInvitedPeople = function(_invitedData, _callbackFn) {
	var fnSrc = 'backendInvite.saveInvitedPeople';
	var sendingObj = {};
	sendingObj.invited_fb_ids = _invitedData.invitedFbIds;
	sendingObj.tracking_code = _invitedData.trackingCode;
	sendingObj.user_id = _invitedData.userId; 
	//Ti.API.info('saveInvitedPeople, sendingObj: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"invite/saved_invited_people";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		      	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _invitedData.userId, null);
				}
		    },
		    onerror: function(e) {
		    	_callbackFn({success:false});
				Ti.App.LogSystem.logSystemData('error', fnSrc + 'onerror:Network Error desc: '+JSON.stringify(e), _invitedData.userId, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);		
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.invited_fb_ids + sendingObj.tracking_code + sendingObj.user_id + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};
