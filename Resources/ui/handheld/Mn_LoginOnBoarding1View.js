LoginOnBoarding1View = function() {
	//create component instance
	var self = Ti.UI.createView({
		left: 0, 
		top: 0,
		width: '100%', 
		height: 398,
		backgroundImage: 'images/onboarding-1.png'
	});
	
//87878f welcome to
	var firstline1 = Ti.UI.createLabel({
		text: 'Welcome to',
		left: 44,
		top: 295,
		color: '#87878f',
		font:{fontWeight:'bold',fontSize:20},
	});
	self.add(firstline1);
	
//7e828c noonswoon
	var firstline2 = Ti.UI.createLabel({
		text: 'NOONSWOON',
		left: 157,
		top: 295,
		color: '#7e828c',
		font:{fontWeight:'bold',fontSize:20},
	});
	self.add(firstline2);
	
//4e5866 dating reimagined
	var description2Lbl = Ti.UI.createLabel({
		text: 'dating reimagined',
		center: {x:'50%', y:325}, //x:67
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:20},
	});
	self.add(description2Lbl);
	
	return self;
};

module.exports = LoginOnBoarding1View;

