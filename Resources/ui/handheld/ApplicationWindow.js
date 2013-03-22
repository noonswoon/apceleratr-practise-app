//Application Window Component Constructor
function ApplicationWindow(_userId, _userImage) {
	Ti.include('ui/handheld/Mn_ChatMainWindow.js');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendCredit = require('backend_libs/backendCredit');
	var ConnectionWindowModule = require('ui/handheld/Rm_ConnectionWindow');
	var CreditSystem = require('internal_libs/creditSystem');
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');	
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
	var LeftMenuWindowModule = require('ui/handheld/Lm_LeftMenuWindow');	
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');
	var MutualFriendsWindowModule = require('ui/handheld/Mn_MutualFriendsWindow');	
	var NoMatchWindowModule = require('ui/handheld/Mn_NoMatchWindow');
	var TimerViewModule = require('ui/handheld/Mn_TimerView');
	var UrbanAirship = require('external_libs/UrbanAirship');
	var UserProfileWindowModule = require('ui/handheld/Mn_UserProfileWindow');

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
		top:0,
		left: 0,
		zIndex: 1,
		backgroundColor:'#7e8185',
		width: 320
	});
	
	var isToggled = false;		
	var leftMenu = new LeftMenuWindowModule(_userId);
	var rightMenu = new ConnectionWindowModule(_userId);

	var openChatWindowCallback = function(e) {
		//Ti.API.info('openning chatroom: '+e.chatRoomName); 
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
		var toggleFlag = true;
		if(e.toggle !== undefined) {
			toggleFlag = e.toggle;
		}
		if(toggleFlag) {
			toggleLeftMenu();
		}
	};
	Ti.App.addEventListener('openInviteFriendWindow', openInviteFriendWindowCallback);
	
	var TargetedModule = require('ui/handheld/Mn_ErrorWindow');
	//var dummyOnBoard = new TargetedModule('');
		
	var noMatchWindow = null;
	var openNoMatchWindowCallback = function(e) {
		var noMatchTimerView = new TimerViewModule();
		noMatchWindow = new NoMatchWindowModule(navigationGroup);
		noMatchWindow.leftNavButton = toggleLeftMenuBtn;
		noMatchWindow.rightNavButton = toggleRightMenuBtn;
		noMatchWindow.titleControl = noMatchTimerView;
		navigationGroup.open(noMatchWindow, {animated:false});
	};
	Ti.App.addEventListener('openNoMatchWindow', openNoMatchWindowCallback);
	
	var openMutualFriendsWindowCallback = function(e) {
		var mutualFriendsArray = e.mutualFriendsArray;
		var mutualFriendsWindow = new MutualFriendsWindowModule(navigationGroup, mutualFriendsArray);
		navigationGroup.open(mutualFriendsWindow, {animated:true});
	};
	Ti.App.addEventListener('openMutualFriendsWindow', openMutualFriendsWindowCallback);

	var inviteCompletedCallback = function(e) {
		Ti.API.info('in inviteCompletedCallback...');
		Ti.App.Flurry.logEvent('invite-success', {numberInvites: e.inviteeList.length});
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			topupAmount += 2;
		}
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList, trackingCode: e.trackingCode};
		Ti.API.info('invitedData: '+JSON.stringify(invitedData));
		
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		
		BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
			CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
		});
	};
	Ti.App.addEventListener('inviteCompleted', inviteCompletedCallback);
	
	//main match page
	var matchWindow = new MatchWindowModule(_userId, null);
	matchWindow.leftNavButton = toggleLeftMenuBtn;
	matchWindow.rightNavButton = toggleRightMenuBtn;
	matchWindow.titleControl = timerView;
	
	var resumeCallback = function() {
		Ti.UI.iPhone.appBadge = null;
		UrbanAirship.resetBadge(UrbanAirship.getDeviceToken());
		if(noMatchWindow !== null) {
			navigationGroup.close(noMatchWindow, {animated:false});
			noMatchWindow = null;
		}
		matchWindow.reloadMatch(); //refresh the content of the match
		rightMenu.reloadConnections();
		
	};
	Ti.App.addEventListener('resume', resumeCallback); 
	
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

	self.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
			if( !isToggled ) {
				matchWindow.touchEnabled = false;
				rightMenu.visible = true;
				self.animate(animateNegativeLeft);
				isToggled = true;
			} else {
				matchWindow.touchEnabled = true;
				self.animate(animateRight);
				isToggled = false;
			}
		} else if (e.direction == 'right') {
			if( !isToggled ) { //show left menu
				matchWindow.touchEnabled = false;
				rightMenu.visible = false;
				self.animate(animateLeft);
				isToggled = true;
			} else {
				matchWindow.touchEnabled = true;
				self.animate(animateRight);
				isToggled = false;
			}
		}	
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
		Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		Ti.App.removeEventListener('resume', resumeCallback); 
		Titanium.Facebook.removeEventListener('logout', facebookLogoutCallback); 
	};
	self.addEventListener('close', windowCloseCallback);
	
	var facebookLogoutCallback = function() {
		self.close();
	};
	Titanium.Facebook.addEventListener('logout', facebookLogoutCallback);
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
