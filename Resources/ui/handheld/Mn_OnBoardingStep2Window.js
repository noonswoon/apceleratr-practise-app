OnBoardingStep2Window = function(_navGroup, _userId) {
	Ti.App.Flurry.logEvent('after-signup-onboard-2-pre-invite');
	
	//create component instance
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
	});
	
	var backgroundView = Ti.UI.createImageView({
		image: 'images/post-onboarding-2.png',
		top: 0,
		left: 0,
		zIndex: 1,
	});
	self.add(backgroundView);
	
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('Invite'),
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
		zIndex: 2,
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('You get better matches'),
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 2,
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: L('with more friends'),
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 2,
	});
	self.add(description2Lbl);
	
	var button = Ti.UI.createButton({
		width: 250, 
		height: 50,
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		zIndex: 2,
	});
	
	var buttonText = Ti.UI.createLabel({
		text: String.format(L('invite x friends'), (Ti.App.NUM_INVITE_ALL+"")),
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 2,
	});
	button.add(buttonText);
	
	self.add(button);
	
	button.addEventListener('click', function() {
		var inviteFriendWindow = new InviteFriendWindowModule(_navGroup, _userId, true);
		inviteFriendWindow.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
													modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});
		//self.close();
		//_navGroup.open(inviteFriendWindow);
	});
	return self;
};

module.exports = OnBoardingStep2Window;

