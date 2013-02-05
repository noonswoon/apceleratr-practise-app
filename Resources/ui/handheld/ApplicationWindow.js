//Application Window Component Constructor
function ApplicationWindow(_userId) {
	Ti.include('ui/handheld/Mn_ChatMainWindow.js');
	var BlankWindowModule = require('ui/handheld/Mn_BlankWindow');
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

	Ti.App.addEventListener('openChatWindow', function(e) {
		var chatRoomName = e.ChatRoomName;
		Ti.API.info('openning chatroom: '+chatRoomName); 
		var pubnubChatWindow = Ti.App.Chat({
		    "chat-room" : e.chatRoomName,
		    "window"    : {backgroundColor:'transparent'},
		    matchId	: e.matchId,
		    userId	: _userId, 
		    otherUserId : e.otherUserId,
		    otherUserFirstName: e.otherUserFirstName,
		    navGroup: navigationGroup,
		});	
		navigationGroup.open(pubnubChatWindow.chatWindow,{animated:false});
		toggleRightMenu();
	});
	
	Ti.App.addEventListener('openProfileWindow', function(e) {
		var userProfileWindow = new MatchWindow(_userId, e.matchId);
		userProfileWindow.setNavGroup(navigationGroup);
		navigationGroup.open(userProfileWindow);
	});

	Ti.App.addEventListener('openUserProfileWindow', function(e) {
		var targetedUserId = e.targetedUserId;
		var userProfileWindow = new UserProfileWindowModule(navigationGroup, _userId, targetedUserId);
		navigationGroup.open(userProfileWindow, {animated:false});
		toggleLeftMenu();
	});
		
	Ti.App.addEventListener('openEditProfileWindow', function(e) {
		var editProfileWindow = new EditProfileWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(editProfileWindow, {animated:false});
		toggleLeftMenu();
	});
	
	Ti.App.addEventListener('openInviteFriendWindow', function(e) {
		var inviteFriendWindow = new InviteFriendWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(inviteFriendWindow, {animated:false});
		toggleLeftMenu();
	});
	
	Ti.App.addEventListener('openNoMatchWindow', function() {
		var noMatchWindow = new NoMatchWindowModule(_userId);
		noMatchWindow.leftNavButton = toggleLeftMenuBtn;
		noMatchWindow.rightNavButton = toggleRightMenuBtn;
		noMatchWindow.titleControl = timerView;
		
		navigationGroup.open(noMatchWindow, {animated:false});
	});
	
	Ti.App.addEventListener('openMutualFriendsWindow', function(e) {
		var mutualFriendsArray = e.mutualFriendsArray;
		var mutualFriendsWindow = new MutualFriendsWindowModule(navigationGroup, mutualFriendsArray);
		navigationGroup.open(mutualFriendsWindow, {animated:true});
	});

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
	
	var blankWindow = BlankWindowModule()
	blankWindow.open(); //hiding the leftMenu and rightMenu behind blank window when the app is starting
	
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
	
	self.closeBlankWindow = function() {
		blankWindow.close();
	};
	
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
