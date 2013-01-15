function LoginProcessWindow() {
    var FbLoginWindowModule = require('ui/handheld/Li_FbLoginWindow');	
    
    //create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		zIndex: 1,
		backgroundColor:'transparent',
		width: 320
	});

	var fbLoginWindow = new FbLoginWindowModule();
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	window: fbLoginWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	fbLoginWindow.setNavGroup(navigationGroup);
    
	self.add(navigationGroup);
	
    return self;
};

module.exports = LoginProcessWindow;