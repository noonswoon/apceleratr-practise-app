LoginOnBoarding1View = function() {
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',		
		image: 'images/onboarding-1.png',
		zIndex: 0,
	});
	
	//87878f welcome to
	var firstline1 = Ti.UI.createLabel({
		text: L('Welcome to'),
		left: 44,
		top: 275,
		color: '#87878f',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
		zIndex:3,
	});
	self.add(firstline1);
	
	//7e828c noonswoon
	var firstline2 = Ti.UI.createLabel({
		text: 'noonswoon',
		left: 165,
		top: 272,
		color: '#7e828c',
		font:{fontWeight:'bold',fontSize:24, fontFamily:'Harabara'},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
		zIndex:3,
	});
	self.add(firstline2);
		
	//4e5866 dating reimagined
	var description2 = Ti.UI.createLabel({
		text: L('Find the One'),
		center: {x:'50%', y:315}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
		zIndex:3,
	});
	self.add(description2);
	
	return self;
};

module.exports = LoginOnBoarding1View;

