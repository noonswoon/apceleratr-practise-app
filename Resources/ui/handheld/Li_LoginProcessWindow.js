function LoginProcessWindow() {
    var LoginOnBoardingModule = require('ui/handheld/Mn_LoginOnBoardingWindow');	

    //create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		zIndex: 1,
		backgroundColor:'transparent',
		width: 320
	});

	var loginOnBoardingWindow = new LoginOnBoardingModule();
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	window: loginOnBoardingWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	loginOnBoardingWindow.setNavGroup(navigationGroup);
    
	self.add(navigationGroup);

    return self;
};

module.exports = LoginProcessWindow;