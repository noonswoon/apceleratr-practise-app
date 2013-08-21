NoMatchWindow = function() {
	Ti.App.GATracker.trackScreen("NoMatchScreen");
	
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
					
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('There\'s no match today'),
		center: {x:'50%', y:'50%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('Check back again at noon tomorrow'),
		center: {x:'50%', y:'58%'}, //x:88
		color: '#919191',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);

	var inviteFriendsButton = Ti.UI.createButton({
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:375}, //x:67
		width: 300, 
		height: 50
	})
	
	var inviteFriendsButtonText = Ti.UI.createLabel({
		text: L('Invite more friends'),
		color: '#616a75',
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'}
	});
	inviteFriendsButton.add(inviteFriendsButtonText);
	
	var moreFriendsText = Ti.UI.createLabel({
		text: L('You get better matches with more friends'),
		color: '#919191',
		center: {x:'50%', y:405},
		font:{fontWeight:'bold',fontSize:12},
		zIndex: 4,
	});
	self.add(moreFriendsText);
	

	inviteFriendsButton.addEventListener('click', function() {
		Ti.App.fireEvent('openInviteFriendWindow', {toggle:false});
	});
	
	self.add(inviteFriendsButton);

	return self;
};

module.exports = NoMatchWindow;

