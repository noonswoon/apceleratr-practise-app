LoginOnBoarding4View = function() {
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-4.png',
		zIndex: 0,
	});

	var description1 = Ti.UI.createLabel({
		text: L('Get connected'),
		center: {x:'50%', y:275},
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description1);			

	var description2 = Ti.UI.createLabel({
		text: L('if you like each other'),
		center: {x:'50%', y:315}, //x:67
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