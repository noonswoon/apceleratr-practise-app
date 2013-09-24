LoginOnBoardingWindow = function(_mainLoginWindow) {
	var CustomPagingControl = require('external_libs/customPagingControl');
	var NetworkDetector = require('bencoding.network');
	
	//create component instance
	
	var navGroup = null;
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		backgroundColor: 'black'
	});

	var iphone5Flag = false;
	var listViewHeight = 376; //480 - 20 (status bar) - 44 (nav bar) - 40 (input view)
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		listViewHeight = 464; // 568 - 57 = 511
		iphone5Flag = true;
	}
	
	var viewsForScrollView = [];
	var view = null;

	var LoginOnBoarding1Module = require('ui/handheld/Mn_LoginOnBoarding1View');
	var loginOnBoarding1View = new LoginOnBoarding1Module();
	viewsForScrollView.push(loginOnBoarding1View);
		
	var LoginOnBoarding2Module = require('ui/handheld/Mn_LoginOnBoarding2View');
	var loginOnBoarding2View = new LoginOnBoarding2Module();
	viewsForScrollView.push(loginOnBoarding2View);
		
	var LoginOnBoarding3Module = require('ui/handheld/Mn_LoginOnBoarding3View');
	var loginOnBoarding3View = new LoginOnBoarding3Module();
	viewsForScrollView.push(loginOnBoarding3View);
		
	var LoginOnBoarding4Module = require('ui/handheld/Mn_LoginOnBoarding4View');
	var loginOnBoarding4View = new LoginOnBoarding4Module();
	viewsForScrollView.push(loginOnBoarding4View);
	
	var LoginOnBoarding5Module = require('ui/handheld/Mn_LoginOnBoarding5View');
	var loginOnBoarding5View = new LoginOnBoarding5Module();
	viewsForScrollView.push(loginOnBoarding5View);
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		showPagingControl:false,
		currentPage:0,
		disableBounce: true,
		zIndex: 0,
	});
	
	var pagingControTop = 368; 
	var tourTextTop = 364;
	var fbButtonYPos = 414;
	var fbButtonTextYPos = 413;
	var neverPostYPos = 445; 

	if(iphone5Flag) {
		pagingControTop = 426;
		tourTextTop = 422;
		fbButtonYPos = 502;
		fbButtonTextYPos = 501;
		neverPostYPos = 533; 
	}
			
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.top = pagingControTop;
	self.add(pagingControl); 
	self.add(scrollView);	

	var tourText = Ti.UI.createLabel({
		text: L('tour ➜'),
		color: '#ffffff',
		top: tourTextTop,
		left: 261,
		font:{fontSize:14, fontWeight:'bold'},
		zIndex: 3,
	});
	self.add(tourText);

	var fbButton = Ti.UI.createButton({
		backgroundImage: 'images/onboarding-facebook-btn.png',
		backgroundSelectedImage: 'images/onboarding-facebook-btn-active.png',
		center: {x:'50%', y:fbButtonYPos}, //y: 428
		width: 250, 
		height: 45,
		zIndex: 0,
	});
	
	var fbButtonText = Ti.UI.createLabel({
		text: L('Connect Privately'),
		color: '#ffffff',
		center: {x: '53%', y:fbButtonTextYPos},
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#3d4d67',
		shadowOffset: {x:0,y:-1},
		zIndex: 2
	});
	self.add(fbButton);
	self.add(fbButtonText);

/*
	var lockImage = Ti.UI.createImageView({
		image: 'images/private-lock.png',
		center: {x:70, y:445}, 
		zIndex: 10,
	});
	self.add(lockImage);
*/
	var neverPostToFb = Ti.UI.createLabel({
		text: L('100% confidential. We never post to Facebook'),
		color: '#ffffff',
		center: {x:'50%', y:neverPostYPos},
		font:{fontSize:12},
		zIndex: 3,
		//left: 82, color: '#898c81',
	});
	self.add(neverPostToFb);
	
	var carrier = NetworkDetector.createCarrier();
	var carrierInfo = carrier.findInfo();

	var mobileCountryCode = carrierInfo.mobileCountryCode + "";
	var mobileNetworkCode = carrierInfo.mobileNetworkCode + "";
	var mobileCarrierCode = mobileCountryCode + mobileNetworkCode;

	//FUNCTIONS CALLBACK
	function successNotifCallback(e) {
		Ti.API.info('in success notif callback..loginonboardingwindow');
		var deviceToken = e.deviceToken;
		Debug.debug_print("Push notification device token is: "+deviceToken);
		Debug.debug_print("Push notification types: "+Titanium.Network.remoteNotificationTypes);
		Debug.debug_print("Push notification enabled: "+Titanium.Network.remoteNotificationsEnabled);
		
		UrbanAirship.registerDeviceToken(deviceToken,0);   
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
//				alert('pn msg: '+JSON.stringify(e));
				
				//insert to the datbase here				
				//try openning window here with the data
				var matchId = e.data['aps']['mid']; //not using yet
				var senderId = e.data['aps']['sid']; //not using yet
				
				//do the parsing, getting rid of name : starting msg
//				var msgIndex = contentMsg.indexOf(":"); 
//				contentMsg = contentMsg.substring(msgIndex 	+ 2);
			} else {
				message = 'No Alert content';
			}
		} else {
			message = 'No APS content';
		}
		Debug.debug_print(message);	
	}	

	var newConnectFlag = true;
	function facebookAuthenCallback(e) {
		//something wrong here..come and fix later..automatically logging in without pressing the button
		if (e.success) {
			showPreloader(self, L('Loading...'));
			Ti.App.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
			    if (e.success) {
			    	var sendingObj = {}; 
			    	sendingObj.mobileCarrierCode = mobileCarrierCode;
			    	sendingObj.deviceId = "";
			        
			        if(Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
			        	sendingObj.deviceId = UrbanAirship.getDeviceToken();
			        }
			        var BackendUser = require('backend_libs/backendUser');
			        var Admin = require('backend_libs/backendUser');

			        if(newConnectFlag) {
			        	newConnectFlag = false;
				        BackendUser.connectToServer(sendingObj, function(_userLogin) {
				        	if(_userLogin.success) {
					        	// check the result data whether it is a new user or existing one
					        	Ti.App.fireEvent('userLoginCompleted', {userId: parseInt(_userLogin.meta.user_id)});
					        	Ti.App.USER_COUNTRY = _userLogin.content.general.country;
					        	Ti.App.CUSTOMER_TYPE = _userLogin.content.customer_type;  //either regular or subscription
					        	
					        	var CreditSystem = require('internal_libs/creditSystem');
					        	CreditSystem.setUserCredit(_userLogin.content.credit); 
					        	if(_userLogin.content.user_status === "new_user") {
					        	//if(true) {
					        		Ti.API.info('***NEW USER****');
									var currentUserId = parseInt(_userLogin.meta.user_id);
									//this will go to onboarding step 1
									Ti.App.fireEvent('openOnboardingStep1', {userId: currentUserId});
					        	} else {
					        		Ti.API.info('***EXISTING USER: id: '+ _userLogin.meta.user_id+' ****');
					        		var currentUserId = parseInt(_userLogin.meta.user_id); 
									var currentUserImage = _userLogin.content.pictures[0].src;
									var currentUserName = _userLogin.content.general.first_name; 
									var ApplicationWindowModule = require('ui/handheld/ApplicationWindow');
									var mainApp = new ApplicationWindowModule(currentUserId, currentUserImage, currentUserName);
									mainApp.open();
									mainApp.unhideCoverView();
									self.close();
					        	}
				        	}
				        	newConnectFlag = true;
				        	hidePreloader(self);
				        });
			        }
				} else if (e.error) {
					hidePreloader(self);
					var loginFailedDialog = Titanium.UI.createAlertDialog({
						title:L('Noonswoon'),
						message:L('There is an error from Facebook login. Please try again.#1')
					});
					loginFailedDialog.show();	
					Ti.App.LogSystem.logSystemData('error', 'Cannot request GraphPath: ' + JSON.stringify(e), null, Ti.App.Facebook.uid);			
				} else {
					hidePreloader(self);
					var loginFailedDialog = Titanium.UI.createAlertDialog({
						title:L('Noonswoon'),
						message:L('There is an error from Facebook login. Please try again.#2')
					});
					loginFailedDialog.show();
					Ti.App.LogSystem.logSystemData('error', 'All hell breaks lose: ' + JSON.stringify(e), null, Ti.App.Facebook.uid);
				}
			});
		} else if (e.error) {
			var loginFailedDialog = Titanium.UI.createAlertDialog({
				title:L('No Facebook Permission'),
				message:L("Please exit Noonswoon and check Settings -> Privacy -> Facebook  Noonswoon must be 'On'")
			});
			loginFailedDialog.show();
			Ti.App.LogSystem.logSystemData('error', 'No Facebook Permission #1', null, Ti.App.Facebook.uid);
		} else if (e.cancelled) {
			Ti.App.LogSystem.logSystemData('info', 'User cancel Facebook Login', null, Ti.App.Facebook.uid);
		
		} else {
			var loginFailedDialog = Titanium.UI.createAlertDialog({
				title:L('No Facebook Permission'),
				message:L("Please exit Noonswoon and check Settings -> Privacy -> Facebook. Noonswoon must be 'On'")
			});
			loginFailedDialog.show();
			Ti.App.LogSystem.logSystemData('error', 'No Facebook Permission #2', null, Ti.App.Facebook.uid);
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

	Ti.App.Facebook.addEventListener('login', facebookAuthenCallback);

	fbButton.addEventListener('click', function() {
		Ti.App.LogSystem.logSystemData('info', 'User logging in with Fb.', null, Ti.App.Facebook.uid);
		if(!Ti.App.Facebook.loggedIn) {
			Ti.App.Facebook.authorize();
		} else { //if already logged in, but somehow land in this page, just fire the event
			Ti.App.Facebook.fireEvent('login',{success:true});
		}
	});

	self.addEventListener('close', function() {
		Ti.App.Facebook.removeEventListener('login', facebookAuthenCallback);
	});
	
	self.setNavGroup = function(_navigationGroup) {
		navGroup = _navigationGroup;
	};
	
	return self;
};

module.exports = LoginOnBoardingWindow;




