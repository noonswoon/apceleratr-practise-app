LoginOnBoarding3View = function() {

	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
		
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-3.png',
		zIndex: 0,
	});
	
	var descriptionYPos = 315;
	if(iphone5Flag) {
		descriptionYPos = 355;
	}
		
	var description = Ti.UI.createLabel({
		text: L('Like or Pass your match'),
		center: {x:'50%', y:descriptionYPos}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description);

	self.addEventListener('postlayout', function() {
		self.width = '100%';
		self.height = '100%';
	});
		
	return self;
};

module.exports = LoginOnBoarding3View;