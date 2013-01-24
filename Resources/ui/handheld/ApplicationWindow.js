//Application Window Component Constructor
function ApplicationWindow(_userId) {
	Ti.include('ui/handheld/Mn_ChatMainWindow.js');
	var TimerViewModule = require('ui/handheld/Mn_TimerView');
	var LeftMenuWindowModule = require('ui/handheld/Lm_LeftMenuWindow');
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');
	var ConnectionWindowModule = require('ui/handheld/Rm_ConnectionWindow');
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var MyProfileWindowModule = require('ui/handheld/Mn_MyProfileWindow');
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
		
	//load component dependencies
	
	var animateLeft	= Ti.UI.createAnimation({
		left: 260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});
	var animateRight = Ti.UI.createAnimation({
		left: 0,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});
	var animateNegativeLeft = Ti.UI.createAnimation({
		left: -260,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
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

	var matchWindow = new MatchWindowModule(_userId, null);
	matchWindow.leftNavButton = toggleLeftMenuBtn;
	matchWindow.rightNavButton = toggleRightMenuBtn;
	matchWindow.titleControl = timerView;
	
	var OnBoardingModule = require('ui/handheld/Mn_LoginOnBoardingWindow');
	var dummyOnBoard = new OnBoardingModule(null, _userId);
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	window: dummyOnBoard,
	  	//window: matchWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	matchWindow.setNavGroup(navigationGroup);

	var isToggled = false;		
	var leftMenu = new LeftMenuWindowModule(_userId);
	leftMenu.open();

	var toggleLeftMenu = function() {
		if( !isToggled ){
			rightMenu.visible = false;
			self.animate(animateLeft);
			isToggled = true;
		} else {
			self.animate(animateRight);
			isToggled = false;
		}
	};
	toggleLeftMenuBtn.addEventListener('click',function(e){
		toggleLeftMenu();
	});

	var rightMenu = new ConnectionWindowModule(_userId);
	rightMenu.open();

	var toggleRightMenu = function() {
		if( !isToggled ){
			rightMenu.visible = true;
			self.animate(animateNegativeLeft);
			isToggled = true;
		} else {
			self.animate(animateRight);
			isToggled = false;
		}
	};
	toggleRightMenuBtn.addEventListener('click',function(e){
		toggleRightMenu();
	});
	
	Ti.App.addEventListener('openChatWindow', function(e) {
		var chatRoomName = e.ChatRoomName;
		Ti.API.info('openning chatroom: '+chatRoomName); 
		var pubnubChatWindow = Ti.App.Chat({
		    "chat-room" : e.chatRoomName,
		    "window"    : {backgroundColor:'transparent'},
		    matchId	: e.matchId,
		    userId	: _userId, 
		    otherUserId : e.otherUserId,
		    otherUserFirstName: e.otherUserFirstName
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
		var myProfileWindow = new MyProfileWindowModule(navigationGroup, _userId);
		navigationGroup.open(myProfileWindow);
		toggleLeftMenu();
	});
		
	Ti.App.addEventListener('openEditProfileWindow', function(e) {
		var editProfileWindow = new EditProfileWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(editProfileWindow);
		toggleLeftMenu();
	});
	
	Ti.App.addEventListener('openInviteFriendWindow', function(e) {
		var inviteFriendWindow = new InviteFriendWindowModule(navigationGroup, _userId, false);
		navigationGroup.open(inviteFriendWindow);
		toggleLeftMenu();
	});
	
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
