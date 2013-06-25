var trackingCode = null;

var showRequestResult = function(e) {
	var s = '';
	if (e.success) {
		if(e.result) {
			if(e.result.indexOf('error_code=100') !== -1) { //have some error
				var tooManyInvitesDialog = Titanium.UI.createAlertDialog({
					title: L('Too Many Facebook Invites'),
					message:L('You can only invite up to 50 Facebook friends per day.'),
					buttonNames: [L('Ok')],
					cancel: 0
				});
				tooManyInvitesDialog.show();
			} else {
				s = "SUCCESS";
				
				var inviteeList = [];
				s += ";e.result: " + e.result;
				var resultArray = e.result.split('&');
				for(var i = 1; i < resultArray.length; i++) {
					var curInvitee = resultArray[i].split('=')[1]; 
					inviteeList.push(curInvitee);
				}
				s += ", inviter: "+Ti.App.Facebook.uid+ ", invitees: "+ JSON.stringify(inviteeList);
				Ti.API.info('invite success info: '+s);
				//add credit here when the invite goes through and track who get invites
				Ti.App.fireEvent('inviteCompleted', {inviteeList:inviteeList, trackingCode: trackingCode});
			}
		}
		if (!e.result && !e.data) {
			s = '"success", but no data from FB.  I am guessing you cancelled the dialog.';
			Ti.App.fireEvent('inviteFailed');
		} 
		Ti.App.LogSystem.logEntryInfo(s);
	} else if (e.cancelled) {
		s = "fb cancel dialog";
		Ti.App.fireEvent('inviteFailed');
		Ti.App.LogSystem.logEntryInfo(s);
	} else {
		s = "fb FAIL dialog";
		if (e.error) s += "; " + e.error;	
		Ti.App.LogSystem.logEntryError(s  + ' (MacAddr: '+ Ti.Platform.id+')');
		Ti.App.Facebook.logout();
	}
};
//send request via facebook to friend who dont have this app:(
	
// http://developer.appcelerator.com/question/74921/switchbox-vs-checkbox#answer-216772
exports.sendRequestOnFacebook = function(_fbIds) {
	trackingCode = Ti.App.Facebook.uid + 'aa' + Ti.App.moment().format('YYYYMMDDTHHmmss'); 
	var data = {
		app_id: Ti.App.Facebook.appid,
	    title: 'Noonswoon',
	    message: 'Love is in the App',
	    redirect_uri: 'http://noonswoon.com/invite/?fb_notif',
	    //to: 202852, 2535734, 1064101575, 810675370',
	    to: _fbIds,
	    data: trackingCode
	 };
	Ti.App.Facebook.dialog("apprequests", data, showRequestResult);
};