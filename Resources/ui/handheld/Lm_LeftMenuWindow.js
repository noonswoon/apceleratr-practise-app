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
	var editProfileView = Ti.UI.createView({
		top: 0,
		left:0,
		width: 260,
		height: 44,
		backgroundColor: '#2c3342'
	});

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
	
	self.add(editProfileView);
	
	//END EDIT SECTION
	//INVITE FRIENDS LABEL SECTION
	var inviteFriendsView = Ti.UI.createView({
		top: 44,
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
	
	inviteFriendsView.add(inviteFriendsLbl);
	inviteFriendsView.add(leftArrow);
	self.add(inviteFriendsView);

	inviteFriendsView.addEventListener('click', function() {
		Ti.App.fireEvent('openInviteFriendWindow');
	});
	
	//END INVITE FRIENDS LABEL SECTION
	
	//INVITE FRIENDS TABLE SECTION
	var topFriendsView = new TopFriendsViewModule(_userId);
	self.add(topFriendsView);
	//END INVITE FRIENDS TABLE SECTION
	
	var inviteButtonView = Ti.UI.createView({
		top: 324,
		height: 50,
		width: 260,
	});
	
	var inviteButton = Ti.UI.createButton({
		width: 240,
		height: 35,
		backgroundColor: '#2e3444',
		top: 5,
		left: 10,
		zIndex: 1
	});
	
	var inviteAllFiveLbl = Ti.UI.createLabel({
		text: 'Invite these 5 friends',
		color: '#939aa7',
		font:{fontWeight:'bold',fontSize:14},
		top: 15,
		left: 50,
		zIndex: 2
	})
	
	inviteButtonView.add(inviteButton);
	inviteButtonView.add(inviteAllFiveLbl);
	
	inviteButton.addEventListener('click', function() {
		Ti.API.info('invite all 5 people');
	});
	
	self.add(inviteButtonView);
		
	return self;
}
module.exports = LeftMenuWindow;