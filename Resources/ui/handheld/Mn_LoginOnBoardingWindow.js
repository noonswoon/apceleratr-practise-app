LoginOnBoardingWindow = function(_navGroup, _userId) {
	var CustomPagingControl = require('external_libs/customPagingControl');
	//create component instance
	
	var navGroup = _navGroup;
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		backgroundColor: 'black'
	});

	var viewsForScrollView = [];
	var view = null;
	for(var i = 1; i <= 4; i++) {
		var LoginOnBoardingModule = require('ui/handheld/Mn_LoginOnBoarding'+i+'View');
		var loginOnBoardingView = new LoginOnBoardingModule();
		viewsForScrollView.push(loginOnBoardingView);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		showPagingControl:false,
		currentPage:0,
		zIndex: 0,
	});
	
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.top = 370;
	self.add(pagingControl); 
	self.add(scrollView);
		
	var fbButton = Ti.UI.createButton({
		backgroundImage: 'images/onboarding-facebook-btn.png',
		backgroundSelectedImage: 'images/onboarding-facebook-btn-active.png',
		backgroundFocusedImage: 'images/onboarding-facebook-btn-active.png',
		center: {x:'50%', y:428}, //x:67
		width: 250, 
		height: 45,
		zIndex: 0,
	});
	
	var fbButtonTextDropShadow = Ti.UI.createLabel({
		text: 'Sign in with Facebook',
		color: '#3d4d67',
		center: {x: '53%', y:426},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 1
	});
	
	var fbButtonText = Ti.UI.createLabel({
		text: 'Sign in with Facebook',
		color: '#ffffff',
		center: {x: '53%', y:427},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 2
	});
	self.add(fbButton);
	self.add(fbButtonTextDropShadow);
	self.add(fbButtonText);
	
	fbButton.addEventListener('touchstart', function() {
		fbButtonText.color = '#888888';
	});
	
	fbButton.addEventListener('touchend', function() {
		fbButtonText.color = '#ffffff';
	});
	
//FUNCTIONS CALLBACK
	function successNotifCallback(e) {
		var deviceToken = e.deviceToken;
		Debug.debug_print("Push notification device token is: "+deviceToken);
		Debug.debug_print("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		Debug.debug_print("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
		
		UrbanAirship.registerDeviceToken(deviceToken);   
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
				
				//try openning window here with the data
/*
				var matchId = e.data['aps']['match_id'];
				var senderId = e.data['aps']['sender_id'];
				var senderImage = e.data['aps']['sender_image'];
				var senderFirstname = e.data['aps']['sender_firstname'];
				var receiverId = e.data['aps']['receiver_id'];
				var receiverImage = e.data['aps']['receiver_image'];
*/				
				var msgDialog = Titanium.UI.createAlertDialog({
					title:'Message from...',
					message:message
				});
				msgDialog.show();
			} else {
				message = 'No Alert content';
			}
		} else {
			message = 'No APS content';
		}
		Debug.debug_print(message);	
	}	

	function facebookAuthenCallback(e) {
		if (e.success) {
			Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
			    if (e.success) {
			        var fbGraphObj = JSON.parse(e.result);  //convert json text to javascript object
					
			        var sendingObj = {}; 
			        
			        sendingObj.userFbId = Ti.Facebook.uid;
			        sendingObj.fbAuthToken = Ti.Facebook.accessToken;
			        sendingObj.devicePlatform = Ti.Platform.osname; 
			        sendingObj.deviceId = "";
			        if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
			        	sendingObj.deviceId = UrbanAirship.getDeviceToken();
			        	sendingObj.devicePlatform = 'iphone';
			        }
			        
			        var BackendUser = require('backend_libs/backendUser');
			        var Admin = require('backend_libs/backendUser');
			        
			        BackendUser.connectToServer(sendingObj, function(_userLogin) {
			        	// check the result data whether it is a new user or existing one
			        	Ti.App.fireEvent('userLoginCompleted', {userId: parseInt(_userLogin.meta.user_id)});
			        	var CreditSystem = require('internal_libs/creditSystem');
			        	Ti.API.info('facebookAuthenCallback, connectToServer userInfo: '+JSON.stringify(_userLogin));
			        	CreditSystem.setUserCredit(_userLogin.content.credit); 
			        	//if(true) {
			        	if(_userLogin.content.user_status === "new_user") {
			        		Ti.API.info('***NEW USER****');
							//this will go to onboarding step 1
							
							var OnBoardingStep1Module = require('ui/handheld/Mn_OnBoardingStep1Window');
							var onBoardingStep1Window = new OnBoardingStep1Module(navGroup, parseInt(_userLogin.meta.user_id));
							navGroup.open(onBoardingStep1Window);
			        	} else {
			        		Ti.API.info('***EXISTING USER: id: '+ _userLogin.meta.user_id+' ****');
			        		var currentUserId = parseInt(_userLogin.meta.user_id); 
							var currentUserImage = _userLogin.content.pictures[0].src;
							var ApplicationWindowModule = require('ui/handheld/ApplicationWindow');
							var mainApp = new ApplicationWindowModule(currentUserId, currentUserImage);
							mainApp.open();
							mainApp.unhideCoverView();
							self.close();
			        	}
			        });
					
				} else if (e.error) {
					Debug.debug_print('cannot request GraphPath: '+ JSON.stringify(e));		
				} else {
					Debug.debug_print("what the hell is going on_2? " + JSON.stringify(e));
					//ErrorHandling.showNetworkError();
				}
			});
		} else if (e.error) {
			Ti.API.info("fb login error: ");
		} else if (e.cancelled) {
			Ti.API.info("fb login Canceled");
		} else {
			Ti.API.info(JSON.stringify(e));
		}
	}	
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

	Ti.Facebook.addEventListener('login', facebookAuthenCallback);

	fbButton.addEventListener('click', function() {
		if(!Ti.Facebook.loggedIn) {
			Ti.Facebook.authorize();
		} else { //if already logged in, but somehow land in this page, just fire the event
			Ti.Facebook.fireEvent('login',{success:true});
		}
	});
	
	self.addEventListener('close', function() {
		Ti.Facebook.removeEventListener('login', facebookAuthenCallback);
	});
	
	self.setNavGroup = function(_navigationGroup) {
		navGroup = _navigationGroup;
	};
	
	return self;
};

module.exports = LoginOnBoardingWindow;




