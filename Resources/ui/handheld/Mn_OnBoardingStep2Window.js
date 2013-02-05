OnBoardingStep2Window = function(_navGroup, _userId) {
	
	//create component instance
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
		backgroundImage: 'images/post-onboarding-2.png'
	});
				
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: 'Invite',
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: 'When you and your friends are on',
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: 'Noonswoon together, everyone\'s',
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description2Lbl);
	
	var description3Lbl = Ti.UI.createLabel({
		text: 'matches are better',
		center: {x:'50%', y:333}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description3Lbl);
	
	var button = Ti.UI.createButton({
		title: 'Invite 10 friends',
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		width: 250, 
		height: 50
	})
	self.add(button);
	
	button.addEventListener('click', function() {
		var inviteFriendWindow = new InviteFriendWindowModule(_navGroup, _userId, true);
		_navGroup.open(inviteFriendWindow);
	});
	return self;
};

module.exports = OnBoardingStep2Window;

