/**
 * @author Mickey Asavanant
 */

exports.redeemCode = function(_userId, _redeemCode, _callbackFn) {
	var fnSrc = 'backendCredit.redeemCode';
	
	var sendingObj = {};
	sendingObj.user_id = _userId;
	sendingObj.redeem_code = _redeemCode;	

	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"credit/activate_redeem";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					resultObj.success = true;
					_callbackFn(resultObj);
				} else {
					Ti.App.LogSystem.logSystemData('error', fnSrc + ', description:'+JSON.stringify(resultObj), _userId, null);
					resultObj.success = false;
					_callbackFn(resultObj);
				}
		    },
		    onerror: function(e) {
	        	Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
	            _callbackFn({success:false});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(Ti.App.VALIDATE_SECURE_CERTIFICATE);
		xhr.open("PUT", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
	    var hashVal = Ti.Utils.sha256(sendingObj.user_id + url + Ti.App.NS_HASH_SECRET_KEY);
	    xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} 
};
