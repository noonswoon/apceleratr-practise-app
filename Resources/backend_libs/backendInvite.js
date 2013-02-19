/**
 * @author Mickey Asavanant
 */

exports.getInvitedList = function(_userId, _callbackFn) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"invite/get_invited_people/"+_userId;
		//Ti.API.info('getInvitedList url: '+url);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					//Ti.API.info('backendInvite.getInvitedList: '+ JSON.stringify(resultObj));
					_callbackFn(resultObj.content.invited_people);
				} else {
					Ti.API.info('Error backendInvite.getInvitedList: '+ JSON.stringify(resultObj));
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {description: 'backendInvite.getInvitedList, server error: ' + resultObj.meta.description});
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in getInvitedList ..server NOT ready yet: "+JSON.stringify(e));
		        _callbackFn({success:false});
		        Ti.App.fireEvent('openErrorWindow', {description: 'backendInvite.getInvitedList, network error'});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
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
	var sendingObj = {};
	sendingObj.user_id = _invitedData.userId; 
	sendingObj.invited_fb_ids = _invitedData.invitedFbIds;
	sendingObj.tracking_code = _invitedData.trackingCode;
	//Ti.API.info('saveInvitedPeople, sendingObj: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"invite/saved_invited_people";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		      	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					Ti.API.info('Error backendInvite.saveInvitedPeople: '+ JSON.stringify(resultObj));
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in backendInvite.saveInvitedPeople ..server NOT ready yet");
		        //Ti.API.debug(e.error);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};
