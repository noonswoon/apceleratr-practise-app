LoginOnBoarding4View = function() {
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-4.png',
		zIndex: 0,
	});
		
	var description = Ti.UI.createLabel({
		text: L('Chat with your matches'),
		center: {x:'50%', y:315}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(description);
	
	return self;
};

module.exports = LoginOnBoarding4View;