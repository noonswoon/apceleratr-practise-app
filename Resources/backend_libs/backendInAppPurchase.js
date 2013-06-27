/**
 * @author Mickey Asavanant
 */

exports.verifyReceipt = function(_userId, _receiptData, _purchaseType, _callbackFn) {
	var fnSrc = 'backendInAppPurchase.verifyReceipt';
	var sendingObj = {};
	sendingObj.user_id = _userId; 
	sendingObj.receipt_data = Ti.Utils.base64encode(_receiptData).toString();
	sendingObj.purchase_type = _purchaseType;
	sendingObj.sandbox = Ti.App.IAP_SANDBOX;
	
//	Ti.API.info('sendingObj: '+JSON.stringify(sendingObj));
//	Ti.API.info('sendingObj receipt_data: '+sendingObj.receipt_data);
	
	Ti.App.LogSystem.logSystemData('info', fnSrc + '. Purchasing type: '+_purchaseType, _userId, null);
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"iap/verify_receipt/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	Ti.API.info('response from server: '+this.responseText);
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					_callbackFn(resultObj.content);
				} else {
					Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta: {description: resultObj.meta + '(UserId: '+_userId+')'}});
				}
		    },
		    onerror: function(e) {
				Ti.App.LogSystem.logSystemData('error', fnSrc + 'onerror:Network Error', _userId, null);
				//var displayError = 'Network Error|Please reopen Noonswoon';
		    	//Ti.App.fireEvent('openErrorWindow', {src: fnSrc, meta:{display_error:displayError, description: displayError + '(UserId: '+_userId+')'}});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	}
};
