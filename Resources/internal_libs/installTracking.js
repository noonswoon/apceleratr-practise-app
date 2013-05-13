exports.isFirstTimeAppOpen = function() {
 	var alreadyOpened = Ti.App.Properties.getBool('alreadyOpened');
    if (!alreadyOpened) { //never launch before
        return true;
    } else {
		return false;
    }
};

exports.markAppOpen = function() {
	Ti.App.Properties.setBool('alreadyOpened', true);
};