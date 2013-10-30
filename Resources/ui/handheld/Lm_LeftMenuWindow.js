LeftMenuWindow = function(_userId, _userName, _userImage) {
	var CreditSystem = require('internal_libs/creditSystem');
	var CreditViewModule = require('ui/handheld/Lm_CreditView');
	var FacebookQuery = require('internal_libs/facebookQuery');

	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:260,
		backgroundColor: '#4a4949',
		zIndex:0,
	});
	
	var menuShadow = Ti.UI.createImageView({
		backgroundImage: 'images/left_menu/left-menu-shadow.png',
		backgroundTopCap: 1,
		top: 0,
		right: 0, 
		width: 12,
		height: '100%',
		zIndex: 5,
	});
	self.add(menuShadow);
	
	// EDIT SECTION
	var noonswoonBrandView = Ti.UI.createView({
		backgroundImage: 'images/menu-bar-stretchable.png',
		top: 0,
		left:0,
		width: 260,
		height: 48,
		zIndex: 0,
	});

	var noonswoonLogoImageView = Ti.UI.createImageView({
		image: 'images/left_menu/menu-logo.png',
		top: 15, 
		left: 9,
		width: 133, 
		height: 16
	});
	noonswoonBrandView.add(noonswoonLogoImageView);
	
/*
	var editProfileIcon = Ti.UI.createImageView({
		image: 'images/menubar-glyph-edit-profile.png',
		left: 10,
		top: 10,
		width: 26,
		height: 26
	});
			
	var editProfileLbl = Ti.UI.createLabel({
		text: L('My Profile'),
		color: '#cac9c9',
		left: 41,
		top: 12,
		font:{fontWeight:'bold',fontSize:18},
	});
*/
	
	//4a4949
/*	
	editProfileIcon.addEventListener('click', function() {
		Ti.App.fireEvent('openUserProfileWindow', {targetedUserId: _userId});
	});
	
	editProfileLbl.addEventListener('click', function() {
		Ti.App.fireEvent('openUserProfileWindow', {targetedUserId: _userId});
	});
*/
	self.add(noonswoonBrandView);
	
	//END EDIT SECTION
	
	var profileSectionView = Ti.UI.createView({
		backgroundColor: '#4a4949',
		top: 48,
		left: 0, 
		width: 260,
		height: 65,
	});

	var profileBorderImage = Ti.UI.createImageView({
		image: 'images/left_menu/menu-profile-overlay.png',
		top: 8,
		left: 8,
		width: 48, 
		height: 47,
		zIndex: 2
	});

	var userProfileImage = Ti.UI.createImageView({
	 	image: _userImage, 
	 	top: 1, 
	 	left: 2, 
	 	width: 44,
	 	height: 44,
	 	zIndex: 3
	});
	profileBorderImage.add(userProfileImage);
	profileSectionView.add(profileBorderImage);
	
	var profileLabel = Ti.UI.createLabel({
		text: L('My Profile'), 
		color: '#cbc8c8', 
		font:{fontWeight:'bold',fontSize:18},
		top: 11, 
		left: 66, 
		shadowColor: '#343333', 
		shadowOffset: {x:0, y:1}
	});
	profileSectionView.add(profileLabel);
	
	var nameStr = _userName; 
	if(nameStr.length > 18) {
		nameStr = nameStr.substr(0,15) + '...';
	}
	
	var nameLabel = Ti.UI.createLabel({
		text: nameStr, 
		color: '#9f9c9c', 
		font:{fontWeight:'bold',fontSize:16},
		top: 30, 
		left: 66, 	
		shadowColor: '#3d3c3c', 
		shadowOffset: {x:0, y:1}
	});
	profileSectionView.add(nameLabel);
	
	var leftArrow = Ti.UI.createImageView({
		image: 'images/menu-separator-arrow.png',
		top: 25,
		right: 10,
		width: 11,
		height: 15
	});
	profileSectionView.add(leftArrow);

	self.add(profileSectionView);
	
	var separatorView = Ti.UI.createView({
		top: 113,
		left:0,
		width: 260,
		height: 38,
		borderColor: 'transparent',
		borderWidth: 0,
		backgroundImage: 'images/menu-separator.png'
	});
	self.add(separatorView);

	var creditSectionView = Ti.UI.createView({
		top: 151, 
		left: 0,
		width: 260,
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
	});
	
	var creditGlyph = Ti.UI.createImageView({
		image: 'images/left_menu/menu-glyph-credits.png',
		top: 10,
		left: 10,
		width: 24, 
		height: 25,
	});
	creditSectionView.add(creditGlyph);
	
	var creditText = Ti.UI.createLabel({
		text: L('Candy'),
		color: '#cbc8c8', 
		font:{fontWeight:'bold',fontSize:18},
		top: 12,
		left: 48,
		shadowColor: '#343333', 
		shadowOffset: {x:0, y:1}	
	});
	creditSectionView.add(creditText);
	
	var creditView = new CreditViewModule(CreditSystem.getUserCredit()); 
	creditSectionView.add(creditView);	
	
	self.add(creditSectionView);

	var tutorialSectionView = Ti.UI.createView({
		top: 196, 
		left: 0,
		width: 260,
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
	});
	
	var tutorialGlyph = Ti.UI.createImageView({
		image: 'images/left_menu/menu-glyph-chemistry.png',
		top: 8,
		left: 14,
		width: 16, 
		height: 28,
	});
	tutorialSectionView.add(tutorialGlyph);
	
	var tutorialText = Ti.UI.createLabel({
		text: L('Tutorial'),
		color: '#cbc8c8', 
		font:{fontWeight:'bold',fontSize:18},
		top: 12,
		left: 48,
		shadowColor: '#343333', 
		shadowOffset: {x:0, y:1}	
	});
	tutorialSectionView.add(tutorialText);
	self.add(tutorialSectionView);

	var contactUsSectionView = Ti.UI.createView({
		top: 241, 
		left: 0,
		width: 260,
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
	});
	
	var contactUsGlyph = Ti.UI.createImageView({
		image: 'images/left_menu/menu-glyph-tutorial.png',
		top: 12,
		left: 10,
		width: 24, 
		height: 22,
	});
	contactUsSectionView.add(contactUsGlyph);
	
	var contactUsText = Ti.UI.createLabel({
		text: L('Support'),
		color: '#cbc8c8', 
		font:{fontWeight:'bold',fontSize:18},
		top: 12,
		left: 48,
		shadowColor: '#343333', 
		shadowOffset: {x:0, y:1}	
	});
	contactUsSectionView.add(contactUsText);
	self.add(contactUsSectionView);
	
	var logoutSectionView = Ti.UI.createView({
		top: 286, 
		left: 0,
		width: 260,
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
	});
	
	var logoutGlyph = Ti.UI.createImageView({
		image: 'images/left_menu/menu-glyph-logout.png',
		top: 12,
		left: 10,
		width: 24, 
		height: 22,
	});
	logoutSectionView.add(logoutGlyph);
	
	var logoutText = Ti.UI.createLabel({
		text: L('Log Out'),
		color: '#cbc8c8', 
		font:{fontWeight:'bold',fontSize:18},
		top: 12,
		left: 48,
		shadowColor: '#343333', 
		shadowOffset: {x:0, y:1}	
	});
	logoutSectionView.add(logoutText);
	self.add(logoutSectionView);

	profileSectionView.addEventListener('touchstart', function() {
		profileSectionView.backgroundColor = '#3b3a3a';
	});
	
	profileSectionView.addEventListener('touchcancel', function() {
		profileSectionView.backgroundColor = '#4a4949';
	});
	
	profileSectionView.addEventListener('touchend', function() {
		profileSectionView.backgroundColor = '#4a4949';
	});
	
	profileSectionView.addEventListener('click', function() {
		Ti.App.fireEvent('openUserProfileWindow', {targetedUserId: _userId});
		Ti.App.NSAnalytics.trackEvent("LeftMenu","ProfileClicked","",1);
	});
	
	creditSectionView.addEventListener('touchstart', function() {
		creditSectionView.backgroundImage = 'images/menu-row-item-active.png';
	});
	
	creditSectionView.addEventListener('touchcancel', function() {
		creditSectionView.backgroundImage = 'images/menu-row-item.png';
	});
	
	creditSectionView.addEventListener('touchend', function() {
		creditSectionView.backgroundImage = 'images/menu-row-item.png';
	});

	creditSectionView.addEventListener('click', function() {
		Ti.App.fireEvent('openCreditOverviewWindow', {targetedUserId: _userId});
		Ti.App.NSAnalytics.trackEvent("LeftMenu","CreditClicked","",1);
	});

	tutorialSectionView.addEventListener('touchstart', function() {
		tutorialSectionView.backgroundImage = 'images/menu-row-item-active.png';
	});
	
	tutorialSectionView.addEventListener('touchcancel', function() {
		tutorialSectionView.backgroundImage = 'images/menu-row-item.png';
	});
	
	tutorialSectionView.addEventListener('touchend', function() {
		tutorialSectionView.backgroundImage = 'images/menu-row-item.png';
	});

	tutorialSectionView.addEventListener('click', function() {
		Ti.App.fireEvent('openTutorialMainWindow');
		Ti.App.NSAnalytics.trackEvent("LeftMenu","TutorialClicked","",1);
	});

	contactUsSectionView.addEventListener('touchstart', function() {
		contactUsSectionView.backgroundImage = 'images/menu-row-item-active.png';
	});
	
	contactUsSectionView.addEventListener('touchcancel', function() {
		contactUsSectionView.backgroundImage = 'images/menu-row-item.png';
	});
	
	contactUsSectionView.addEventListener('touchend', function() {
		contactUsSectionView.backgroundImage = 'images/menu-row-item.png';
	});

	contactUsSectionView.addEventListener('click', function() {
		Ti.App.fireEvent('contactUsEmailDialog');
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = L("Noonswoon Support");
		emailDialog.toRecipients = ['support@noonswoon.com'];
		emailDialog.messageBody = L('Please let us know what you would like to do') + '\n\n\n\n\n\n(UserId: ' + _userId + ').';
		emailDialog.barColor = '#850f16';
		emailDialog.open();
	});

	logoutSectionView.addEventListener('touchstart', function() {
		logoutSectionView.backgroundImage = 'images/menu-row-item-active.png';
	});
	
	logoutSectionView.addEventListener('touchcancel', function() {
		logoutSectionView.backgroundImage = 'images/menu-row-item.png';
	});
	
	logoutSectionView.addEventListener('touchend', function() {
		logoutSectionView.backgroundImage = 'images/menu-row-item.png';
	});

	logoutSectionView.addEventListener('click', function() {
		
		if(Ti.App.Facebook.loggedIn) {
			Ti.App.Facebook.logout();
		} else {
			Ti.App.fireEvent('launchLoginScreen');  
		}
		
		Ti.App.NSAnalytics.trackEvent("LeftMenu","LogoutClicked","",1);
	});
	
	//check if we need to fetch fb friends for local db or not
	if(CacheHelper.shouldFetchData('FacebookFriendQuery_'+Ti.App.Facebook.uid, 0)) {
		Ti.API.info('have NOT fetched fb data');
		CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.App.Facebook.uid); //no need to fetch again
		FacebookQuery.queryFacebookFriends();
	}  else {
		Ti.API.info('already fetched fb data...');
		//might not have the data in the scenario where the user deleted the app and re-install again
		var targetedList = FacebookFriendModel.getTopFiveFacebookFriends(); 
		if(targetedList.length === 0) {
			Ti.API.info('refresh again...');
			CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.App.Facebook.uid); //no need to fetch again
			FacebookQuery.queryFacebookFriends();
		}
	}	
	
	var coverView = Titanium.UI.createView({
		top:0,
		left:0,
		width:260,
		backgroundColor: '#eeeeee',
		zIndex:5,
	});
	self.add(coverView);
	
	self.unhideCoverView = function() {
		self.remove(coverView);
	};
			
	return self;
};
module.exports = LeftMenuWindow;