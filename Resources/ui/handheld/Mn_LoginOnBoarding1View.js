LoginOnBoarding1View = function() {
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%', 
		height: '100%',
		image: 'images/onboarding-1.png',
		zIndex: 0,
	});
	
	//87878f welcome to
	var firstline1 = Ti.UI.createLabel({
		text: 'Welcome to',
		left: 44,
		top: 275,
		color: '#87878f',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
	});
	self.add(firstline1);
	
	var firstline1Shadow = Ti.UI.createLabel({
		text: 'Welcome to',
		left: 44,
		top: 276,
		color: '#ffffff',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:2,
	});
	self.add(firstline1Shadow);
	
	//7e828c noonswoon
	var firstline2 = Ti.UI.createLabel({
		text: 'noonswoon',
		left: 165,
		top: 272,
		color: '#7e828c',
		font:{fontWeight:'bold',fontSize:24, fontFamily:'Harabara'},
		zIndex:3,
	});
	self.add(firstline2);
	var firstline2Shadow = Ti.UI.createLabel({
		text: 'noonswoon',
		left: 165,
		top: 273,
		color: '#ffffff',
		font:{fontWeight:'bold',fontSize:24, fontFamily:'Harabara'},
		zIndex:2,
	});
	self.add(firstline2Shadow);
		
	//4e5866 dating reimagined
	var description2 = Ti.UI.createLabel({
		text: 'dating reimagined',
		center: {x:'50%', y:315}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:3,
	});
	self.add(description2);
	var description2Shadow = Ti.UI.createLabel({
		text: 'dating reimagined',
		center: {x:'50%', y:316}, //x:67
		color: '#ffffff',
		font:{fontWeight:'bold',fontSize:20},
		zIndex:2,
	});
	self.add(description2Shadow);	
	
	return self;
};

module.exports = LoginOnBoarding1View;

