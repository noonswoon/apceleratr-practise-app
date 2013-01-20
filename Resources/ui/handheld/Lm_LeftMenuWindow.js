LeftMenuWindow = function(_userId) {
	var CreditViewModule = require('ui/handheld/Lm_CreditView');
	var TopFriendsViewModule = require('ui/handheld/Lm_TopFriendsView');
	
	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:260,
		backgroundColor: '#32394a'
	});

	// EDIT SECTION
	var editProfileViewTopBorder = Ti.UI.createView({
		top: 0, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#565d6c',
		zIndex: 1
	});
	
	var editProfileViewBottomBorder = Ti.UI.createView({
		top: 42, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#111b33',
		zIndex: 1
	});
	
	var editProfileView = Ti.UI.createView({
		backgroundColor: 'transparent',
		top: 0,
		left:0,
		width: 260,
		height: 42,
		zIndex: 0,
	});
	editProfileView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#424a5a', offset: 0.0}, { color: '#242b39', offset: 1.0 }]
	};
	
	var editProfileIcon = Ti.UI.createImageView({
		image: 'images/icon/option.png',
		left: 10,
		top: 10,
		width: 25,
		height: 25
	});
			
	var editProfileLbl = Ti.UI.createLabel({
		text: 'Edit profile',
		color: '#b9c1cf',
		left: 55,
		top: 10,
		font:{fontWeight:'bold',fontSize:16},
	});
	
	var creditView = new CreditViewModule(40); 

	editProfileView.add(editProfileIcon);
	editProfileView.add(editProfileLbl);
	editProfileView.add(creditView);
	
	editProfileIcon.addEventListener('click', function() {
		Ti.App.fireEvent('openUserProfileWindow');
	});
	
	editProfileLbl.addEventListener('click', function() {
		Ti.App.fireEvent('openUserProfileWindow');
	});
	
	self.add(editProfileViewTopBorder);
	self.add(editProfileViewBottomBorder);
	self.add(editProfileView);
	
	//END EDIT SECTION
	//INVITE FRIENDS LABEL SECTION
	var inviteFriendsView = Ti.UI.createView({
		top: 43,
		left:0,
		width: 260,
		height: 30,
		backgroundColor: '#3e4558'
	});	
	
	var inviteFriendsLbl = Ti.UI.createLabel({
		text: 'INVITE SINGLE FRIENDS',
		left: 10,
		top: 5,
		color: '#959dab',
		font:{fontWeight:'bold',fontSize:12},
	});
	
	var leftArrow = Ti.UI.createImageView({
		image: 'images/leftmenu/arrow_leftmenu.png',
		right: 10,
		top: 5,
		width: 20,
		height: 20
	});
	
	var inviteFriendsViewBottomBorder = Ti.UI.createView({
		top: 73, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#242a37',
		zIndex: 1
	});
	
	
	inviteFriendsView.add(inviteFriendsLbl);
	inviteFriendsView.add(leftArrow);
	self.add(inviteFriendsView);
	self.add(inviteFriendsViewBottomBorder);

	inviteFriendsView.addEventListener('click', function() {
		Ti.App.fireEvent('openInviteFriendWindow');
	});
	
	//END INVITE FRIENDS LABEL SECTION
	
	//INVITE FRIENDS TABLE SECTION
	var topFriendsView = new TopFriendsViewModule(_userId);
	self.add(topFriendsView);
	//END INVITE FRIENDS TABLE SECTION
	
	var inviteButton = Ti.UI.createButton({
		backgroundImage: 'none',
		backgroundColor: 'transparent',
		borderColor: '#242a37', 
		borderRadius: 5,
		borderWidth: 1,
		top:330,
		left: 10,
		width:240,
		height:35,
		color: '#9299a6',
		font:{fontSize:14,fontWeight:'bold'},
		title:'Invite these 5 friends'
	});
	inviteButton.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#394155', offset: 0.0}, { color: '#292f3d', offset: 1.0 }]
	};
	
	inviteButton.addEventListener('click', function() {
		Ti.API.info('invite all 5 people');
	});

	self.add(inviteButton);	
		
	return self;
}
module.exports = LeftMenuWindow;