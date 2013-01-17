var showRequestResult = function(e) {
	var s = '';
	if (e.success) {
		s = "SUCCESS";
		if (e.result) {
			var inviteeList = [];
			s += ";e.result: " + e.result;
			var resultArray = e.result.split('&');
			for(var i = 1; i < resultArray.length; i++) {
				var curInvitee = resultArray[i].split('=')[1]; 
				inviteeList.push(curInvitee);
			}
			s += ", inviter: "+Titanium.Facebook.uid+ ", invitees: "+ JSON.stringify(inviteeList);
			
			//add credit here when the invite goes through and track who get invites
			Ti.App.fireEvent('inviteCompleted', {inviteeList:inviteeList});
		}

		if (!e.result && !e.data) {
			s = '"success", but no data from FB.  I am guessing you cancelled the dialog.';
			Ti.App.fireEvent('inviteFailed');
		} 
	} else
	if (e.cancelled) {
		s = "fb cancel dialog";
		Ti.App.fireEvent('inviteFailed');
	}
	else {
		s = "fb FAIL dialog";
		if (e.error) s += "; " + e.error;	
	}
	Ti.API.info(s);
};
//send request via facebook to friend who dont have this app:(
	
// http://developer.appcelerator.com/question/74921/switchbox-vs-checkbox#answer-216772
exports.sendRequestOnFacebook = function(_fbIds) {
	//var SettingHelper = require('helpers/settingHelper');
	//if(SettingHelper.getFacebookShare()) {
		var data = {
	 		app_id: Ti.Facebook.appid,
	    	message: 'A new way to meet quality peopple!',
	    	redirect_uri: 'http://noonswoon.com/invite/?fb_notif',
	    	to: _fbIds
	 	};
		Titanium.Facebook.dialog("apprequests", data, showRequestResult);
	//}
};

