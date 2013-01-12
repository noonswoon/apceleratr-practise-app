exports.getUserCredit = function() {
	if(!Ti.App.Properties.hasProperty('userCredit')) { //do some caching
		Ti.App.Properties.setInt('userCredit',0);
		return 0;
	} else {
		var userCredit = Ti.App.Properties.getInt('userCredit');
		return userCredit;
	}	
};

exports.setUserCredit = function(_userCredit) {
	Ti.App.Properties.setInt('userCredit',_userCredit);
	Ti.App.fireEvent('creditChange');
};