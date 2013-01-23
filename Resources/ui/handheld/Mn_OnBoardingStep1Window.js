OnBoardingStep1Window = function(_navGroup, _userId) {
	
	//create component instance
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
		backgroundImage: 'images/post-onboarding-1.png'
	});
				
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: 'Personalize',
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: 'View and edit your profile',
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: 'and put yourself in the best light!',
		center: {x:'50%', y:318}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description2Lbl);
	
	var viewProfileBtn = Ti.UI.createButton({
		title: 'View my profile',
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		width: 250, 
		height: 50
	})
	self.add(viewProfileBtn);
	
	viewProfileBtn.addEventListener('click', function() {
		Ti.API.info('edit profile with userId: '+_userId);
	});
	return self;
};

module.exports = OnBoardingStep1Window;

