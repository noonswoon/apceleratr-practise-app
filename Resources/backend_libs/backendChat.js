/**
 * @author Mickey Asavanant
 */
exports.getUnreadChatHistory = function(_paramObj, _callbackFn) {
	var fnSrc = 'backendChat.getUnreadChatHistory';
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
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _paramObj.userId, null);
					//Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta: {description: JSON.stringify(resultObj.meta) + '(UserId: '+_paramObj.userId+')'}});
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _paramObj.userId, null);
	            //var displayError = 'Network Error|Please reopen Noonswoon';
	            //Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:displayError, description: displayError + '(UserId: '+_paramObj.userId+')'}});
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
	}
};

exports.getAllChatHistory = function(_paramObj, _callbackFn) {
	var fnSrc = 'backendChat.getAllChatHistory';
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
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _paramObj.userId, null);
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _paramObj.userId, null);
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
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/chat_all_history_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj);
		}
	}
};

exports.getChatHistory = function(_paramObj, _callbackFn) { //not used at the moment
	var fnSrc = 'backendChat.getChatHistory';
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
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _paramObj.userId, null);
				}
	        },
	        onerror : function(e) {
	            _callbackFn({success:false});
	            Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _paramObj.userId, null);
	            //var displayError = 'Network Error|Please reopen Noonswoon';
	            //Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:displayError, description: displayError + '(UserId: '+_paramObj.userId+')'}});
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
	sendingObj.message = _messageObj.message;
	sendingObj.receiver_id = _messageObj.receiverId;
	sendingObj.sender_id = _messageObj.senderId;
	
	//Ti.API.info('sending this obj to save to server: '+JSON.stringify(sendingObj));
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"chat/save/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					_callbackFn({success:false});
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _messageObj.senderId, null);
				}
		    },
		    onerror: function(e) {
				_callbackFn({success:false});
				// this function is called when an error occurs, including a timeout
		    	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _messageObj.senderId, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');

		var hashVal = Ti.Utils.sha256(sendingObj.senderId + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};