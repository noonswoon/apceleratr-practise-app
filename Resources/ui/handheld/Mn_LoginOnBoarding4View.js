LoginOnBoarding4View = function() {
	
	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-4.png',
		zIndex: 0,
	});

	var description1YPos = 275;
	var description2YPos = 315;
	if(iphone5Flag) {
		description1YPos = 325;
		description2YPos = 365;
	}
	
	var description1 = Ti.UI.createLabel({
		text: L('Get connected'),
		center: {x:'50%', y:description1YPos},
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description1);			

	var description2 = Ti.UI.createLabel({
		text: L('if you like each other'),
		center: {x:'50%', y:description2YPos}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description2);	
	
	return self;
};

module.exports = LoginOnBoarding4View;