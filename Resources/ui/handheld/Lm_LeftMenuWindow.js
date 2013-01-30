LeftMenuWindow = function(_userId) {
	var CreditSystem = require('internal_libs/creditSystem');
	var CreditViewModule = require('ui/handheld/Lm_CreditView');
	var TopFriendsViewModule = require('ui/handheld/Lm_TopFriendsView');
	
	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:260,
		backgroundColor: '#585858'
	});

	// EDIT SECTION
	var editProfileView = Ti.UI.createView({
		backgroundImage: 'images/menu-bar-stretchable.png',
		top: 0,
		left:0,
		width: 260,
		height: 48,
		zIndex: 0,
	});

	
	var editProfileIcon = Ti.UI.createImageView({
		image: 'images/menubar-glyph-edit-profile.png',
		left: 10,
		top: 10,
		width: 26,
		height: 26
	});
			
	var editProfileLbl = Ti.UI.createLabel({
		text: 'My Profile',
		color: '#cac9c9',
		left: 41,
		top: 12,
		font:{fontWeight:'bold',fontSize:18},
	});

	var creditView = new CreditViewModule(CreditSystem.getUserCredit()); 
	
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
		top: 43,
		left:0,
		width: 260,
		height: 38,
//		backgroundColor: 'yellow',
		borderColor: 'transparent',
		borderWidth: 0,
		backgroundImage: 'images/menu-separator.png'
	});	
	
	var inviteFriendsLbl = Ti.UI.createLabel({
		text: 'INVITE OTHER FRIENDS',
		left: 11,
		top: 11,
		color: '#ababab',
		font:{fontWeight:'bold',fontSize:12},
	});
	
	var leftArrow = Ti.UI.createImageView({
		image: 'images/menu-separator-arrow.png',
		left: 242,
		top: 10,
		width: 11,
		height: 15
	});
	
	
	inviteFriendsView.add(inviteFriendsLbl);
	inviteFriendsView.add(leftArrow);
	self.add(inviteFriendsView);

	inviteFriendsView.addEventListener('click', function() {
		Ti.App.fireEvent('openInviteFriendWindow');
	});
	
	inviteFriendsView.addEventListener('touchstart', function() {
		inviteFriendsView.backgroundImage = 'images/menu-separator-active.png';
	});
	
	inviteFriendsView.addEventListener('touchend', function() {
		inviteFriendsView.backgroundImage = 'images/menu-separator.png';
	});
	
	//END INVITE FRIENDS LABEL SECTION
	
	//INVITE FRIENDS TABLE SECTION
	var topFriendsView = new TopFriendsViewModule(_userId);
	self.add(topFriendsView);
	//END INVITE FRIENDS TABLE SECTION
			
	return self;
}
module.exports = LeftMenuWindow;