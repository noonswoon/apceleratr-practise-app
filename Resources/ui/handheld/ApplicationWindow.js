//Application Window Component Constructor
function ApplicationWindow(_userId) {
	
	var TimerViewModule = require('ui/handheld/Td_TimerView');
	var MatchWindowModule = require('ui/handheld/Td_Match');
	//load component dependencies
	
	var animateLeft	= Ti.UI.createAnimation({
		left: 260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});
	var animateRight = Ti.UI.createAnimation({
		left: 0,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});
	var animateNegativeLeft = Ti.UI.createAnimation({
		left: -260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});
	
	var timerView = new TimerViewModule();
		
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		zIndex: 1,
		backgroundColor:'transparent',
	});

	Ti.API.info('hello');
	var matchWindow = new MatchWindowModule(_userId, null);
	Ti.API.info('world');
			
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	window: matchWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	
	var toggleLeftMenuBtn = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.PLAY,
		left: 10,
		width: 30,
		height: 30,
		top: 10
	});
	
	var leftMenu	= Ti.UI.createWindow({
		backgroundColor: 'red',
		top:   0,
		left:  0,
		width: 260,
	});
	var data = [{title:"Row 1"},{title:"Row 2"},{title:"Row 3"},{title:"Row 4"}];
	var tableView	= Ti.UI.createTableView({ data: data, backgroundColor:'transparent' });
	leftMenu.add(tableView);
	leftMenu.open();

	var isToggled = false;
	toggleLeftMenuBtn.addEventListener('click',function(e){
		if( !isToggled ){
			rightMenu.visible = false;
			self.animate(animateLeft);
			isToggled = true;
		} else {
			self.animate(animateRight);
			isToggled = false;
		}
	});

	var rightMenu	= Ti.UI.createWindow({
		backgroundColor: 'blue',
		top:   0,
		right:  0,
		width: 260,
		visible: false
	});
	var data = [{title:"Row 1"},{title:"Row 2"},{title:"Row 3"},{title:"Row 4"}];
	var tableView2	= Ti.UI.createTableView({ data: data, backgroundColor:'transparent' });
	rightMenu.add(tableView2);
	rightMenu.open();

	var toggleRightMenuBtn = Titanium.UI.createButton({
		image: 'images/icon/act_chat.png',
		right: 10,
		width: 30,
		height: 30,
		top: 10
	});

	toggleRightMenuBtn.addEventListener('click',function(e){
		if( !isToggled ){
			rightMenu.visible = true;
			self.animate(animateNegativeLeft);
			isToggled = true;
		} else {
			self.animate(animateRight);
			isToggled = false;
		}
	});
	
	navigationGroup.add(toggleLeftMenuBtn);
	navigationGroup.add(toggleRightMenuBtn);
	navigationGroup.add(timerView);
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
