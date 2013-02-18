/**
 * @author Mickey Asavanant
 */

////////////////// START REAL-CODE /////////////////////////////
exports.getChatHistory = function(_paramObj, _callbackFn) {

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER + "chat/"+_paramObj.matchId+"/get_chat_history/"+_paramObj.userId+"/"+_paramObj.page;
		//Ti.API.info('getChatHistory api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
	        		resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.API.info('Error getChatHistory: '+ JSON.stringify(resultObj));
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow');
				}
	        },
	        onerror : function(e) {
	            Ti.API.info('getChatHistory Network Connection Error. ' + JSON.stringify(e));
	            _callbackFn({success:false});
	            Ti.App.fireEvent('openErrorWindow');
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));	    
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/chat_history_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj);
		} else {
			Ti.API.error("something wrong with backendUser.getChatHistory")
		}
	}
};

exports.saveChatMessage = function(_messageObj, _callbackFn) {
	
	var sendingObj = {}; 
	sendingObj.match_id = _messageObj.matchId; 
	sendingObj.sender_id = _messageObj.senderId;
	sendingObj.receiver_id = _messageObj.receiverId;
	sendingObj.message = _messageObj.message;
	
	//Ti.API.info('sending this obj to save to server: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"chat/save/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					Ti.API.info("something wrong with backendChat.saveChatMessage: "+JSON.stringify(resultObj));
					Ti.App.fireEvent('openErrorWindow');
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("server error with backendChat.saveChatMessage: "+JSON.stringify(e));
		        Ti.App.fireEvent('openErrorWindow');
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};

exports.sendNotification = function(_messageObj, _callbackFn) {
	var sendingObj = {}; 
	sendingObj.match_id = _messageObj.matchId; 
	sendingObj.sender_id = _messageObj.senderId;
	sendingObj.receiver_id = _messageObj.receiverId;
	sendingObj.message = _messageObj.message;
	
	//Ti.API.info('sendNotification to server: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"chat/send_notification/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn({success:true});
				} else {
					Ti.API.info("something wrong with backendChat.sendNotification: "+JSON.stringify(resultObj));
					_callbackFn({success:false});
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("server error with backendChat.saveChatMessage: "+JSON.stringify(e));
		        Ti.App.fireEvent('openErrorWindow');
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};