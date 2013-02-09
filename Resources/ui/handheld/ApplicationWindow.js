//Application Window Component Constructor
function ApplicationWindow(_userId, _userImage) {
	Ti.include('ui/handheld/Mn_ChatMainWindow.js');
	var TimerViewModule = require('ui/handheld/Mn_TimerView');
	var LeftMenuWindowModule = require('ui/handheld/Lm_LeftMenuWindow');
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');
	var ConnectionWindowModule = require('ui/handheld/Rm_ConnectionWindow');
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var UserProfileWindowModule = require('ui/handheld/Mn_UserProfileWindow');
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
	var NoMatchWindowModule = require('ui/handheld/Mn_NoMatchWindow');
	var MutualFriendsWindowModule = require('ui/handheld/Mn_MutualFriendsWindow');
	
	//load component dependencies
	
	var animateLeft	= Ti.UI.createAnimation({
		left: 260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 200
	});
	var animateRight = Ti.UI.createAnimation({
		left: 0,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 200
	});
	var animateNegativeLeft = Ti.UI.createAnimation({
		left: -260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 200
	});
	
	var toggleLeftMenuBtn = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		width:44,
		height:30,
		image: 'images/topbar-glyph-menu.png'
	});
	
	var toggleRightMenuBtn = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-chat.png'
	});
	
	var timerView = new TimerViewModule();
		
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		zIndex: 1,
		backgroundColor:'#7e8185',
		width: 320
	});
	
	var isToggled = false;		
	var leftMenu = new LeftMenuWindowModule(_userId);
	var rightMenu = new ConnectionWindowModule(_userId);

	var openChatWindowCallback = function(e) {
		Ti.API.info('openning chatroom: '+e.chatRoomName); 
		var pubnubChatWindow = Ti.App.Chat({
		    "chat-room" : e.chatRoomName,
		    "window"    : {backgroundColor:'transparent'},
		    matchId	: e.matchId,
		    userId	: _userId, 
		    userImage: _userImage,
		    otherUserId : e.otherUserId,
		    otherUserFirstName: e.otherUserFirstName,
		    otherUserImage: e.otherUserImage,
		    otherUserGuid: e.otherUserGuid,
		    navGroup: navigationGroup,
		});	
		navigationGroup.open(pubnubChatWindow.chatWindow,{animated:false});
		toggleRightMenu();
	};
	Ti.App.addEventListener('openChatWindow', openChatWindowCallback);
	
	var openProfileWindowCallback = function(e) {
		var userProfileWindow = new MatchWindow(_userId, e.matchId);
		userProfileWindow.setNavGroup(navigationGroup);
		navigationGroup.open(userProfileWindow);
	};
	Ti.App.addEventListener('openProfileWindow', openProfileWindowCallback);

	var openUserProfileWindowCallback = function(e) {
		Ti.API.info('ApplicationWindow: listened to openUserProfileWindow event');
		var targetedUserId = e.targetedUserId;
		var userProfileWindow = new UserProfileWindowModule(navigationGroup, _userId, targetedUserId);
		navigationGroup.open(userProfileWindow, {animated:false});
		toggleLeftMenu();
	};
	Ti.App.addEventListener('openUserProfileWindow', openUserProfileWindowCallback);
		
	var openEditProfileWindowCallback = function(e) {
		var editProfileWindow = new EditProfileWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(editProfileWindow, {animated:false});
		toggleLeftMenu();
	};
	Ti.App.addEventListener('openEditProfileWindow', openEditProfileWindowCallback);
	
	var openInviteFriendWindowCallback = function(e) {
		var inviteFriendWindow = new InviteFriendWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(inviteFriendWindow, {animated:false});
		toggleLeftMenu();
	};
	Ti.App.addEventListener('openInviteFriendWindow', openInviteFriendWindowCallback);
	
	var openNoMatchWindowCallback = function(e) {
		var noMatchWindow = new NoMatchWindowModule(_userId);
		noMatchWindow.leftNavButton = toggleLeftMenuBtn;
		noMatchWindow.rightNavButton = toggleRightMenuBtn;
		noMatchWindow.titleControl = timerView;
		
		navigationGroup.open(noMatchWindow, {animated:false});
	};
	Ti.App.addEventListener('openNoMatchWindow', openNoMatchWindowCallback);
	
	var openMutualFriendsWindowCallback = function(e) {
		var mutualFriendsArray = e.mutualFriendsArray;
		var mutualFriendsWindow = new MutualFriendsWindowModule(navigationGroup, mutualFriendsArray);
		navigationGroup.open(mutualFriendsWindow, {animated:true});
	};
	Ti.App.addEventListener('openMutualFriendsWindow', openMutualFriendsWindowCallback);

	//main match page
	var matchWindow = new MatchWindowModule(_userId, null);
	matchWindow.leftNavButton = toggleLeftMenuBtn;
	matchWindow.rightNavButton = toggleRightMenuBtn;
	matchWindow.titleControl = timerView;
	
	var TargetedModule = require('ui/handheld/Mn_ErrorWindow');
	var dummyOnBoard = new TargetedModule();
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	//window: dummyOnBoard,
	  	window: matchWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	matchWindow.setNavGroup(navigationGroup);
	
	leftMenu.open();
	rightMenu.open();
	
	var toggleLeftMenu = function() {
		if( !isToggled ){
			matchWindow.touchEnabled = false;
			rightMenu.visible = false;
			self.animate(animateLeft);
			isToggled = true;
		} else {
			matchWindow.touchEnabled = true;
			self.animate(animateRight);
			isToggled = false;
		}
	};
	toggleLeftMenuBtn.addEventListener('click',function(e){
		toggleLeftMenu();
	});
	
	var toggleRightMenu = function() {
		if( !isToggled ){
			matchWindow.touchEnabled = false;
			rightMenu.visible = true;
			self.animate(animateNegativeLeft);
			isToggled = true;
		} else {
			matchWindow.touchEnabled = true;
			self.animate(animateRight);
			isToggled = false;
		}
	};
	toggleRightMenuBtn.addEventListener('click',function(e){
		toggleRightMenu();
	});
	
	self.unhideCoverView = function() {
		leftMenu.unhideCoverView();
		rightMenu.unhideCoverView();
	};
	
	var windowCloseCallback = function() {
		Ti.API.info('ApplicationWindow is close....');
		Ti.App.removeEventListener('openChatWindow', openChatWindowCallback);
		Ti.App.removeEventListener('openProfileWindow', openProfileWindowCallback);
		Ti.App.removeEventListener('openUserProfileWindow', openUserProfileWindowCallback);
		Ti.App.removeEventListener('openEditProfileWindow', openEditProfileWindowCallback);
		Ti.App.removeEventListener('openInviteFriendWindow', openInviteFriendWindowCallback);
		Ti.App.removeEventListener('openNoMatchWindow', openNoMatchWindowCallback);
		Ti.App.removeEventListener('openMutualFriendsWindow', openMutualFriendsWindowCallback);
		Ti.Facebook.removeEventListener('logout', facebookLogoutCallback); 
	};
	self.addEventListener('close', windowCloseCallback);
	
	var facebookLogoutCallback = function() {
		self.close();
	};
	Ti.Facebook.addEventListener('logout', facebookLogoutCallback);
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
