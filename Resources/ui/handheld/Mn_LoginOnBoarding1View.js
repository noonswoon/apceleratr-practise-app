LoginOnBoarding1View = function() {
	
	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/onboarding-1.png',
		zIndex: 0,
	});
	

	var firstline1YPos = 275;
	var firstline2YPos = 272;
	var descriptionYPos = 315;
	if(iphone5Flag) {
		firstline1YPos = 305;
		firstline2YPos = 302;
		descriptionYPos = 345;
	}	
	
	//87878f welcome to
	var firstline1 = Ti.UI.createLabel({
		text: L('Welcome to'),
		left: 44,
		top: firstline1YPos,
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
		top: firstline2YPos,
		color: '#7e828c',
		font:{fontWeight:'bold',fontSize:24, fontFamily:'Harabara'},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
		zIndex:3,
	});
	self.add(firstline2);
		
	//4e5866 dating reimagined
	var description2 = Ti.UI.createLabel({
		text: L('Love is in the App'),
		center: {x:'50%', y:descriptionYPos}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
		zIndex:3,
	});
	self.add(description2);
	
	self.addEventListener('postlayout', function() {
		self.width = '100%';
		self.height = '100%';
	});
	return self;
};

module.exports = LoginOnBoarding1View;

