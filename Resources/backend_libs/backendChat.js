/**
 * @author Mickey Asavanant
 */
exports.getUnreadChatHistory = function(_paramObj, _callbackFn) {
	if(Ti.App.LIVE_DATA) {
		
		var url = Ti.App.API_SERVER + "chat/"+_paramObj.matchId+"/get_unread_msg/"+_paramObj.userId+"/";
		Ti.API.info('getUnreadChatHistory api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
	        		resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getUnreadChatHistory', meta:resultObj.meta});
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getUnreadChatHistory', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));	    
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	}
};

exports.getAllChatHistory = function(_paramObj, _callbackFn) {
	if(Ti.App.LIVE_DATA) {
		
		var url = Ti.App.API_SERVER + "chat/"+_paramObj.matchId+"/get_all_chat_history/"+_paramObj.userId+"/";
		Ti.API.info('getAllChatHistory api point: '+url);
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				var resultObj = JSON.parse(this.responseText);
	        	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
	        		resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getAllChatHistory', meta:resultObj.meta});
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getAllChatHistory', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
	        },
		    timeout:50000  // in milliseconds 
	    });
	    xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));	    
	    xhr.setRequestHeader('Content-Type','application/json');
	    xhr.send();
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/chat_all_history_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj);
		}
	}
};

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
					_callbackFn({success:false});
					Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getChatHistory', meta:resultObj.meta});
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.fireEvent('openErrorWindow', {src: 'backendChat.getChatHistory', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
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
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("server error with backendChat.saveChatMessage: "+JSON.stringify(e));
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
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};