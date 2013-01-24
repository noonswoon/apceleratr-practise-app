LoginOnBoardingWindow = function(_navGroup, _userId) {
	var CustomPagingControl = require('external_libs/customPagingControl');
	//create component instance
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		backgroundColor: '#232323'
	});
	
	var viewsForScrollView = [];
	var view = null;
	for(var i = 1; i <= 4; i++) {
		var LoginOnBoardingModule = require('ui/handheld/Mn_LoginOnBoarding'+i+'View');
		var loginOnBoardingView = new LoginOnBoardingModule();
		viewsForScrollView.push(loginOnBoardingView);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		left: 0,
		top: 0,
		width: '100%',
		height: 398,
		showPagingControl:false,
		currentPage:0,
		zIndex: 0,
	});
	
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.top = 370;
	self.add(pagingControl); 
	self.add(scrollView);
		
	var fbButton = Ti.UI.createButton({
		backgroundImage: 'images/facebook_button.png',
		center: {x:'50%', y:428}, //x:67
		width: 250, 
		height: 45,
		zIndex: 0,
	});
	
	var fbButtonTextDropShadow = Ti.UI.createLabel({
		text: 'Sign in with Facebook',
		color: '#3d4d67',
		center: {x: '53%', y:426},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 1
	});
	
	var fbButtonText = Ti.UI.createLabel({
		text: 'Sign in with Facebook',
		color: '#ffffff',
		center: {x: '53%', y:427},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 2
	});
	self.add(fbButton);
	self.add(fbButtonTextDropShadow);
	self.add(fbButtonText);

	fbButton.addEventListener('click', function() {
		Ti.API.info('login with facebook');
	});
	
	fbButton.addEventListener('touchstart', function() {
		fbButtonText.color = '#888888';
	});
	
	fbButton.addEventListener('touchend', function() {
		fbButtonText.color = '#ffffff';
	});
	
	return self;
};

module.exports = LoginOnBoardingWindow;

