/**
 * @author Mickey Asavanant
 */

exports.verifyReceipt = function(_userId, _receiptData, _purchaseType, _callbackFn) {
	var fnSrc = 'backendInAppPurchase.verifyReceipt';
	var sendingObj = {};
	sendingObj.purchase_type = _purchaseType;
	sendingObj.receipt_data = Ti.Utils.base64encode(_receiptData).toString();
	sendingObj.user_id = _userId; 
	
//	Ti.API.info('sendingObj: '+JSON.stringify(sendingObj));
//	Ti.API.info('sendingObj receipt_data: '+sendingObj.receipt_data);
	
	Ti.App.LogSystem.logSystemData('info', fnSrc + '. Purchasing type: '+_purchaseType, _userId, null);
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"iap/verify_receipt";
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
				Ti.App.LogSystem.logSystemData('error', fnSrc + ', onerror:Network Error desc: '+JSON.stringify(e), _userId, null);
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.setValidatesSecureCertificate(false);		
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		var hashVal = Ti.Utils.sha256(sendingObj.user_id + url + Ti.App.NS_HASH_SECRET_KEY);
		xhr.setRequestHeader('NsHashKey',hashVal);	 	
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	}
};
