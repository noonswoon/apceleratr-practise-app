LoginOnBoarding5View = function() {
	
	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
		
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-5.png',
		zIndex: 0,
	});

	var descriptionYPos = 315;
	if(iphone5Flag) {
		descriptionYPos = 355;
	}

	var description = Ti.UI.createLabel({
		text: L('Chat anonymously'),
		center: {x:'50%', y:descriptionYPos}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description);
	
	return self;
};

module.exports = LoginOnBoarding5View;