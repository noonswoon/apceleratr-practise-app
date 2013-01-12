/**
 * @author Mickey Asavanant
 */

exports.getUserCredit = function(_userId, _callbackFn) {
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"credit/get/"+_userId;
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content.credit);
				} else {
					Ti.API.info('Error getUserCredit: '+ JSON.stringify(resultObj));
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in backendGetUserCredit ..server NOT ready yet");
		        Ti.API.info(JSON.stringify(e));
		        //Ti.API.debug(e.error);
		    },
		    timeout:5000  // in milliseconds
		});
		xhr.open("GET", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send();  // request is actually sent with this statement		
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/user_credits_obj.txt');
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			var credit = resultObj.content.credit; 
			//Ti.API.info("getUserCredit: "+JSON.stringify(resultObj));	
			_callbackFn(credit);
		} else {
			Ti.API.error("something wrong with backendCredit.getUserCredit")
		}
	}
};

exports.transaction = function(_paramObj, _callbackFn) {
	var sendingObj = {};
	Ti.API.info('transaction params: '+ JSON.stringify(_paramObj));
	sendingObj.user_id = _paramObj.userId; 
	sendingObj.amount = _paramObj.amount; 
	sendingObj.action = _paramObj.action;

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"credit/transaction/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content.user_credit);
				} else {
					Ti.API.info('Error credit.transaction: '+ JSON.stringify(resultObj));
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		        Ti.API.info("in backendCredit.transaction ..server NOT ready yet");
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
		var f = null; 
		if(_actionObj.action == 'like') {
			f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/credit_transaction_like_obj.txt');
		} else if(_actionObj.action == 'mutual_friend') {
			f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/credit_transaction_mutual_obj.txt');
		} else {
			f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/credit_transaction_invite_obj.txt');
		}
		var contents = f.read();
		var resultObj = JSON.parse(contents.text); 
		if(resultObj.meta.status == "ok") {
			_callbackFn(resultObj.content.user_credit);
		} else {
			Ti.API.error("something wrong with backendInvite.getInvitedList");
		}	
	}
};
