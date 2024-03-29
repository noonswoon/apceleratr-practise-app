//Application Window Component Constructor
function ApplicationWindow(_userId, _userImage, _userName) {
	Ti.include('ui/handheld/Mn_ChatMainWindow.js');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendUser = require('backend_libs/backendUser');
	var ConnectionWindowModule = require('ui/handheld/Rm_ConnectionWindow');
	var CreditSystem = require('internal_libs/creditSystem');
	var CreditOverviewWindowModule = require('ui/handheld/Mn_CreditOverviewWindow');
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');	
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
	var LeftMenuWindowModule = require('ui/handheld/Lm_LeftMenuWindow');	
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');
	var MutualFriendsWindowModule = require('ui/handheld/Mn_MutualFriendsWindow');	
	var NoMatchWindowModule = require('ui/handheld/Mn_NoMatchWindow');
	var TimerViewModule = require('ui/handheld/Mn_TimerView');
	var TutorialMainWindowModule = require('ui/handheld/Mn_TutorialMainWindow');
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
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		width:44,
		height:30,
		image: 'images/topbar-glyph-menu.png'
	});

	var toggleRightMenuBtn = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-chat.png'
	});
	
	var toggleRightMenuGreenBtn = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-green-button.png',
		backgroundSelectedImage: 'images/top-bar-green-button-active.png',
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
	var leftMenu = new LeftMenuWindowModule(_userId, _userName, _userImage);
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
		
		pubnubChatWindow.chatWindow.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,navBarHidden:false});
	};
	Ti.App.addEventListener('openChatWindow', openChatWindowCallback);

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

	var openCreditOverviewWindowCallback = function(e) {
		var creditOverviewWindow = new CreditOverviewWindowModule(navigationGroup, _userId);
		navigationGroup.open(creditOverviewWindow, {animated:false});
		toggleLeftMenu();
	};
	Ti.App.addEventListener('openCreditOverviewWindow', openCreditOverviewWindowCallback);
	
	
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

	var openTutorialMainWindowCallback = function(e) {
		var tutorialMainWindow = new TutorialMainWindowModule();
		tutorialMainWindow.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,navBarHidden:true});
	};
	Ti.App.addEventListener('openTutorialMainWindow', openTutorialMainWindowCallback);
		
	//var TargetedModule = require('ui/handheld/Mn_TutorialMainView');
	//var dummyOnBoard = new TargetedModule();
		
	var noMatchWindow = null;
	var openNoMatchWindowCallback = function(e) {
		var noMatchTimerView = new TimerViewModule();
		noMatchWindow = new NoMatchWindowModule(e.reason);
		noMatchWindow.leftNavButton = toggleLeftMenuBtn;
		noMatchWindow.rightNavButton = toggleRightMenuBtn;
		noMatchWindow.titleControl = noMatchTimerView;
		navigationGroup.open(noMatchWindow, {animated:false});
	};
	Ti.App.addEventListener('openNoMatchWindow', openNoMatchWindowCallback);
	
	var openMutualFriendsWindowCallback = function(e) {
		var mutualFriendsArray = e.mutualFriendsArray;
		var isLatestMatch = e.isLatestMatch;
		
		var mutualFriendsWindow = new MutualFriendsWindowModule(navigationGroup, mutualFriendsArray, isLatestMatch);
		if(isLatestMatch) {
			navigationGroup.open(mutualFriendsWindow, {animated:true});
		} else {
			mutualFriendsWindow.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,navBarHidden:false});
		}
	};
	Ti.App.addEventListener('openMutualFriendsWindow', openMutualFriendsWindowCallback);

	var inviteCompletedCallback = function(e) {
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList, trackingCode: e.trackingCode};
		BackendInvite.saveInvitedPeople(invitedData, function(e) {
			if(e.success) {
				Ti.App.CUSTOMER_TYPE = e.content.customer_type;
				CreditSystem.setUserCredit(e.content.credit); //sync the credit >> change to 90 credits initially
			}
		});
		
		Ti.App.NSAnalytics.trackEvent("InviteForCredits","inviteCompleted",'inviter: '+_userId,e.inviteeList.length);
	};
	Ti.App.addEventListener('inviteCompleted', inviteCompletedCallback);
	
	//main match page
	var matchWindow = new MatchWindowModule(_userId, null);
	matchWindow.leftNavButton = toggleLeftMenuBtn;
	matchWindow.rightNavButton = toggleRightMenuBtn;
	matchWindow.titleControl = timerView;

	var showUnreadChatGreenButtonCallback = function(e) {
		matchWindow.rightNavButton = toggleRightMenuGreenBtn;
	};
	Ti.App.addEventListener('showUnreadChatGreenButton', showUnreadChatGreenButtonCallback);
	
	var showNormalChatButtonCallback = function(e) {
		matchWindow.rightNavButton = toggleRightMenuBtn;
	};
	Ti.App.addEventListener('showNormalChatButton', showNormalChatButtonCallback);
	
	var closeMutualFriendsWindowCallback = function(e) {
		var isLatestMatch = e.isLatestMatch;
		matchWindow.notifyMutualFriendsWindowClose();
	};
	Ti.App.addEventListener('closeMutualFriendsWindow', closeMutualFriendsWindowCallback);
		
	function successNotifCallback(e) {
		var deviceToken = e.deviceToken; //check on this
		UrbanAirship.registerDeviceToken(deviceToken,_userId); 
		BackendUser.updatePNToken(_userId, deviceToken, function(e) {});
	}
	
	function errorNotifCallback(e) {
    	alert(L("Error during registration: ") + e.error);
	}
	
	//continue here...
	function messageNotifCallback(e) {
		// called when a push notification is received.
		//Debug.debug_print("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e));
		var message;
		if(e.data['aps'] != undefined) {
			if(e.data['aps']['alert'] != undefined){

				message = e.data['aps']['alert'];
			} else {
				message = 'No Alert content';
			}
		} else {
			message = 'No APS content';
		}
	}	
	
	var resumeCallback = function() {
		var CacheHelper = require('internal_libs/cacheHelper');
		CacheHelper.resetDisplayOopAlert();
		// register for push notifications
		if(Ti.Platform.osname != 'android') {
			Titanium.Network.registerForPushNotifications({
				types:[
					Titanium.Network.NOTIFICATION_TYPE_BADGE,
					Titanium.Network.NOTIFICATION_TYPE_ALERT,
					Titanium.Network.NOTIFICATION_TYPE_SOUND
				],
				success: successNotifCallback, //successful registration will call this fn
				error: errorNotifCallback, //failed registration will call this
				callback: messageNotifCallback //when receive the message will call this fn
			});
		}
		
		//wait for about 2 seconds til the app powers up
		setTimeout(function() {
			//check the internet connection here...
			if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
				//firing the event
				Ti.App.fireEvent('openNoInternetWindow');
			} else {
				BackendUser.updateClientVersion(_userId, function(e) {});
				//check if authentication still valid
				if(!Ti.App.Facebook.loggedIn) { //if fb already exipired
					//clear up cache so we can refresh and load new fb friends
					Ti.App.Properties.removeProperty('FacebookFriendQuery_'+Ti.App.Facebook.uid);
					Ti.App.LogSystem.logSystemData('info', 'Resume and found out that Fb Token Exipred', _userId, Ti.App.Facebook.uid);					
					Ti.App.fireEvent('launchLoginScreen');
				} else {
					Ti.UI.iPhone.appBadge = null;
					UrbanAirship.resetBadge(UrbanAirship.getDeviceToken()); //need to check on this for the valid token
					if(noMatchWindow !== null) {
						navigationGroup.close(noMatchWindow, {animated:false});
						noMatchWindow = null;
					}
					matchWindow.reloadMatch(); //refresh the content of the match
					rightMenu.reloadConnections();
				}
			} 
		}, 500);
	};
	Ti.App.addEventListener('resume', resumeCallback); 
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	//window: dummyOnBoard,
	  	window: matchWindow,
	  	top: 0,
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
	
	toggleRightMenuGreenBtn.addEventListener('click',function(e){
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
		Ti.App.removeEventListener('openUserProfileWindow', openUserProfileWindowCallback);
		Ti.App.removeEventListener('openEditProfileWindow', openEditProfileWindowCallback);
		Ti.App.removeEventListener('openInviteFriendWindow', openInviteFriendWindowCallback);
		Ti.App.removeEventListener('openNoMatchWindow', openNoMatchWindowCallback);
		Ti.App.removeEventListener('openMutualFriendsWindow', openMutualFriendsWindowCallback);
		Ti.App.removeEventListener('openTutorialMainWindow', openTutorialMainWindowCallback);		
		Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		Ti.App.removeEventListener('resume', resumeCallback); 
		Ti.App.removeEventListener('closeMutualFriendsWindow', closeMutualFriendsWindowCallback);
		Ti.App.removeEventListener('showUnreadChatGreenButton', showUnreadChatGreenButtonCallback);
		Ti.App.removeEventListener('showNormalChatButton', showNormalChatButtonCallback);		
		Ti.App.removeEventListener('launchLoginScreen', launchLoginScreenCallback); 
	};
	self.addEventListener('close', windowCloseCallback);
	
	var launchLoginScreenCallback = function() {
		self.close();
	};
	
	Ti.App.addEventListener('launchLoginScreen', launchLoginScreenCallback);
	
	self.add(navigationGroup);
				
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
