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

exports.trackScreen = function(_screenName) {
	Ti.App.GATracker.trackScreen(_screenName);
	Ti.App.Localytics.tagScreen(_screenName);
};

exports.trackEvent = function(_eventCategory, _eventAction, _eventLabel, _eventValue) {
	Ti.App.GATracker.trackEvent({
		category: _eventCategory,
		action: _eventAction,
		label: _eventLabel,
		value: _eventValue
	});

	Ti.App.Localytics.tagEvent(_eventCategory, {"action":_eventAction}, {"label":_eventLabel}, _eventValue);
};