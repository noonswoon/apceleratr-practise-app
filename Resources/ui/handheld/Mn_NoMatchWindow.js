NoMatchWindow = function(_reasonCode) {
	Ti.App.NSAnalytics.trackScreen("NoMatchScreen");
	
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee'
	});

	var imageView = Ti.UI.createImageView({
		image: 'images/error/message-no-match.png',
		width: 184, 
		height: 165,
		center: {x:'50%', y:'30%'}
	});
	self.add(imageView); 

	var headlineLblText = L('There\'s no match today');
 	var descriptionText = L('Check back again at noon tomorrow');
 	var smallDescriptionText = L('You get better matches with more friends');
  
 	if(_reasonCode == 2) {
 		headlineLblText = L('Thank you for your love!');
 		descriptionText = L('Sorry but your country is not supported yet');
 		smallDescriptionText = L('We will let you know as soon as we launch!');
 	}
 
					
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: headlineLblText,
		center: {x:'50%', y:'50%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: descriptionText,
		center: {x:'50%', y:'58%'}, //x:88
		color: '#919191',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var moreFriendsText = Ti.UI.createLabel({
		text: smallDescriptionText,
		color: '#919191',
		center: {x:'50%', y:405},
		font:{fontWeight:'bold',fontSize:12},
		zIndex: 4,
	});
	self.add(moreFriendsText);
	
	var inviteFriendsButton = null;
	var inviteFriendsButtonText = null;
	if(_reasonCode === 1) {
		inviteFriendsButton = Ti.UI.createButton({
			backgroundImage: 'images/post-onboarding-button.png',
			backgroundSelectedImage: 'images/post-onboarding-button-active.png',
			center: {x:'50%', y:375}, //x:67
			width: 300, 
			height: 50
		});
		
		inviteFriendsButtonText = Ti.UI.createLabel({
			text: L('Invite more friends'),
			color: '#616a75',
			font:{fontWeight:'bold',fontSize:18},
			center: {x:'50%', y:'50%'}
		});
		inviteFriendsButton.add(inviteFriendsButtonText);
		
		inviteFriendsButton.addEventListener('click', function() {
			Ti.App.fireEvent('openInviteFriendWindow', {toggle:false});
		});
 
 		self.add(inviteFriendsButton);
 	}

	return self;
};

module.exports = NoMatchWindow;

