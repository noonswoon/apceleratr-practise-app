/**
 * @author Mickey Asavanant
 */

exports.verifyReceipt = function(_userId, _receiptData, _purchaseType, _callbackFn) {
	var sendingObj = {};
	//Ti.API.info('transaction params: '+ JSON.stringify(_paramObj));
	sendingObj.user_id = _userId; 
	sendingObj.receipt_data = Ti.Utils.base64encode(_receiptData).toString();
	sendingObj.purchase_type = _purchaseType;
	sendingObj.sandbox = Ti.App.IAP_SANDBOX;
	
//	Ti.API.info('sendingObj: '+JSON.stringify(sendingObj));
//	Ti.API.info('sendingObj receipt_data: '+sendingObj.receipt_data);
	
	//if(false) {
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"iap/verify_receipt/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	Ti.API.info('response from server: '+this.responseText);
		    	var resultObj = JSON.parse(this.responseText);
		      	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					alert('verify receipt successful');
					_callbackFn(resultObj.content);
				} else {
					Ti.App.fireEvent('openErrorWindow', {src: 'backendInAppPurchase.verifyReceipt', meta:resultObj.meta});
				}
		    },
		    onerror: function(e) {
				Ti.App.fireEvent('openErrorWindow', {src: 'backendInAppPurchase.verifyReceipt', meta:{display_error:'Network Error|Please reopen Noonswoon'}});
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement
	} else {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'mock_data/iap_verify_receipt.txt');
		var contents = f.read();
		Ti.API.info('contents.text: '+contents.text);
		//var resultObj = JSON.parse(contents.text); 
//		if(resultObj.meta.status == "ok") {
//			_callbackFn(resultObj);
//		} else {
//			Ti.API.error("something wrong with backendInAppPurchase.verifyReceipt");
//		}	
	}
};
