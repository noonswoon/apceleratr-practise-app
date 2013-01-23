var FbLoginWindow = function() {
	
	var navGroup = null;
	//UI STUFF
	var self = Ti.UI.createWindow({
		backgroundColor:'transparent',
		backgroundImage: '/images/bg.png',
		title: "Login",
		barColor: '#398bb0',
		layout: 'vertical',
		tabBarHidden: true,
		navBarHidden: true
	});

	var dtLogo = Ti.UI.createImageView({
		image: '/images/admin/dressntie_logo.png',
		top: 100,
		width: 173, height: 56,
	});	
	
	var dtLabel = Ti.UI.createLabel({
		text: 'Quality dating made easy',
		top: 5,
		height: 30,
		font: {fontSize: 14, fontWeight: 'bold'},
		color: '#8b8b8b'
	});
	
	var fbLoginButton = Ti.UI.createButton({
		top: 5,
		width: 200,
		height: 39,
		backgroundImage: '/images/admin/button/fb_button_login.png',
		visible: true
	});	
	
	var fbLogOutButton = Ti.UI.createButton({
		title:'fb_logout',
		top:35,
		width:200,
		height:20,
		visible:true
	});
	
	var whyFbBtn = Ti.UI.createButton({
		backgroundImage: '/images/admin/button/button_whyfb.png',
		top:70,
		width:145,
		height:27,
		visible:true
	});
	
	var registerPushNotifBtn = Ti.UI.createButton({
		title:'Register device',
		top:0,
		width:200,
		height:20
	});
	
	var label = Ti.UI.createLabel({
		text:'Attempting to register with Apple for Push Notifications...',
		textAlign:'center',
		width:'auto',
		backgroundColor: 'white'
	});
	
	//ADDING UI COMPONENTS TO WINDOW
	self.add(dtLogo);
	self.add(dtLabel);
	self.add(fbLoginButton);
	self.add(fbLogOutButton);

	self.add(whyFbBtn);
	
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
	
	function messageNotifCallback(e) {
		// called when a push notification is received.
		//Debug.debug_print("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e));
		var message;
		if(e.data['aps'] != undefined) {
			if(e.data['aps']['alert'] != undefined){
				if(e.data['aps']['alert']['body'] != undefined){
					message = e.data['aps']['alert']['body'];
				} else {
					message = e.data['aps']['alert'];
					//try openning window here
				}
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
	
	//EVENTS REGISTERING		
	fbLoginButton.addEventListener('click', function() {
		Ti.Facebook.authorize();
	});
	
	whyFbBtn.addEventListener('click', function() {
		var WhyFbWindow = require('ui/handheld/Li_WhyFbWindow');
		var whyfbwin = new WhyFbWindow();
		navGroup.open(whyfbwin);
	});

	fbLogOutButton.addEventListener('click', function() {
		Ti.Facebook.logout(); //logout from fb
	});

	function facebookAuthenCallback(e) {
		if (e.success) {
			Ti.API.info('in fbAuthenCallback e.success');
			Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
			    if (e.success) {
			        var fbGraphObj = JSON.parse(e.result);  //convert json text to javascript object
					
			        var sendingObj = {}; 
			        
			        sendingObj.userFbId = Ti.Facebook.uid;
			        sendingObj.fbAuthToken = Ti.Facebook.accessToken;
			        sendingObj.devicePlatform = Ti.Platform.osname; 
			        sendingObj.deviceId = "82DFA37CD520A0CBF2EF92A2138550AE88829C08EC01DE2109FE61FC3ADE82D5";
			        if(Ti.Platform.os === 'iPhone')
			        	sendingObj.deviceId = UrbanAirship.getDeviceToken();
			        		        
			        var BackendUser = require('backend_libs/backendUser');
			        var Admin = require('backend_libs/backendUser');
			        
			        BackendUser.connectToServer(sendingObj, function(_userLogin) {
			        	// check the result data whether it is a new user or existing one
			        	if(_userLogin.content.user_status === "new_user") {
			        		Ti.API.info('***NEW USER****');
							//this will go to onboarding step 1

			        		var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');		        		
			        		var editProfileWindow = new EditProfileWindowModule(navGroup, _userLogin.meta.user_id, true);
							navGroup.open(editProfileWindow);
			        	} else {
			        		Ti.API.info('***EXISTING USER: id: '+ _userLogin.meta.user_id+' ****');
			        		var ApplicationWindowModule = require('ui/handheld/ApplicationWindow');
							var mainApp = new ApplicationWindowModule(_userLogin.meta.user_id);
							mainApp.open();
							
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
			alert("Facebook Login Error...please try again");
		}
	}
	
	self.addEventListener('close', function() {
		Ti.Facebook.removeEventListener('login', facebookAuthenCallback);
	});

	Ti.Facebook.addEventListener('login', facebookAuthenCallback);
	
	Ti.Facebook.addEventListener('logout', function() {
		alert('logging out from fb');
	});
		
	self.setNavGroup = function(_navGroup) {
		navGroup = _navGroup;
	}
	
	return self;
};

module.exports = FbLoginWindow;

