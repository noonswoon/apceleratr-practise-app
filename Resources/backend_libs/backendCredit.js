/**
 * @author Mickey Asavanant
 */

exports.getUserCredit = function(_userId, _callbackFn) {
	var fnSrc = 'backendCredit.getUserCredit';
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"credit/get/"+_userId;
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content.credit);
				} else {
					Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta: {description: resultObj.meta + '(UserId: '+_userId+')'}});
				}
		    },
		    onerror: function(e) {
		    	Ti.App.LogSystem.logSystemData('error', fnSrc + 'onerror:Network Error', _userId, null);
		    	//var displayError = 'Network Error|Please reopen Noonswoon';
		    	//Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:displayError, description: displayError + '(UserId: '+_userId+')'}});
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