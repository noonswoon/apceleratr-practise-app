// TODO: RC 1.4 Code

/*
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 */

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//GLOBAL VARIABLES DECARATION
Ti.App.CLIENT_VERSION = '1.3';
Ti.App.IS_PRODUCTION_BUILD = true;
Ti.App.PN_PRODUCTION_BUILD = true; //if true, will only work if it is a production/adhoc build
Ti.App.IS_ON_DEVICE = true;
Ti.App.ACTUAL_FB_INVITE = true;
Ti.App.IAP_SANDBOX = false;

Ti.App.Facebook = require('facebook');
Ti.App.Facebook.permissions = ['email', 'user_relationships', 'user_relationship_details', 'user_education_history', 'user_hometown', 
							'user_location', 'user_birthday', 'user_religion_politics', 'user_work_history', 
							'user_photos', 'user_about_me', 'friends_location', 'friends_relationships'];					
Ti.App.Facebook.forceDialogAuth = false;

Ti.App.DATABASE_NAME = "Noonswoon";
Ti.App.LIKE_CREDITS_SPENT = 10;
Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT = 5;
Ti.App.OFFERED_CITIES = '';
Ti.App.NUM_TOP_FRIENDS = 5; 
Ti.App.NUM_INVITE_ALL = 5;
Ti.App.MAXIMUM_FB_INVITES_PER_DAY = 50;
Ti.App.Properties.setString('clientVersion',Ti.App.CLIENT_VERSION);
Ti.App.LOGENTRIES_TOKEN = "02058f2f-7caf-4da0-9da8-996537c31122";
Ti.App.NOONSWOON_PRODUCTS = ['com.noonswoon.launch.c1', 'com.noonswoon.launch.c2', 'com.noonswoon.launch.c3'];
//'com.noonswoon.launch.monthly', 'com.noonswoon.launch.yearly']; 

if(Ti.App.IS_PRODUCTION_BUILD) { //production, adhoc build
	Ti.App.API_SERVER = "http://noonswoon.com/";
	Ti.App.API_ACCESS = "n00nsw00n:he1p$1ngle";
	Ti.App.API_ROUTING_SERVER = "http://noonswoon.com/";
	Ti.App.API_ROUTING_ACCESS = "n00nsw00n:he1p$1ngle";
	Ti.App.Facebook.appid = "132344853587370";
} else {
	Ti.App.API_SERVER = "http://noonswoondevelopment.apphb.com/";  	//need to change to test server
	Ti.App.API_ACCESS = "noondev:d0minate$";		//need to change to test server login/password
	Ti.App.API_ROUTING_SERVER = "http://noonswoondevelopment.apphb.com/";
	Ti.App.API_ROUTING_ACCESS = "noondev:d0minate$";
	Ti.App.Facebook.appid = "492444750818688";
}

if(Ti.App.PN_PRODUCTION_BUILD) {
	Ti.App.URBAN_AIRSHIP_APP_KEY = "y3en0sTuREKQlFvB6Lop0A";
	Ti.App.URBAN_AIRSHIP_APP_SECRET = "FTsofROESraMdFuLY-x0RQ";
} else {
	Ti.App.URBAN_AIRSHIP_APP_KEY = "-iH8x1gCSA-myDRSkHtW1A";
	Ti.App.URBAN_AIRSHIP_APP_SECRET = "aRdpicLSSSuGFMJWGUGTaw";	
}

Ti.App.CACHE_TIMEOUT = 1;
Ti.App.BACKGROUND_BAR_COLOR_THEME = '#3f5a95';
Ti.App.LIVE_DATA = true;

//include require
if(Ti.Platform.osname == 'iphone') {
	Ti.include('external_libs/TiPreloader.js');
	Ti.include('external_libs/cacheFromRemote.js');
} else {
	Ti.include('/Resources/external_libs/TiPreloader.js');
	Ti.include('/Resources/external_libs/cacheFromRemote.js');
}

Ti.App.moment = require('external_libs/moment');
Ti.App.LogSystem = require('internal_libs/logSystem');
	
//Ti.App.Flurry = require('ti.flurry');
//Ti.App.Flurry.debugLogEnabled = true;
//Ti.App.Flurry.eventLoggingEnabled = true;
//Ti.App.Flurry.initialize('Y5G7SF86VBTQ5GGWQFT5');

Ti.App.Storekit = require('ti.storekit');
Ti.App.Storekit.receiptVerificationSandbox = true;
Ti.App.Storekit.receiptVerificationSharedSecret = "240fcd041cf141b78c4d95eb6fa95df2";

var CacheHelper = require('internal_libs/cacheHelper');
var Debug = require('internal_libs/debug');
var FacebookFriendModel = require('model/facebookFriend');
var FacebookQuery = require('internal_libs/facebookQuery');
var ModelMetaData = require('model/metaData');
var ServerRoutingSystem = require('internal_libs/serverRoutingSystem');
var UrbanAirship = require('external_libs/UrbanAirship');

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with multiple windows in a stack
(function() {
	//render appropriate components based on the platform and form factor
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var BackendInvite = require('backend_libs/backendInvite');
	var BackendGeneralInfo = require('backend_libs/backendGeneralInfo');
	var ErrorWindowModule = require('ui/handheld/Mn_ErrorWindow');
	var InstallTracking = require('internal_libs/installTracking');
	var ModelChatHistory = require('model/chatHistory');
	var ModelEthnicity = require('model/ethnicity');
	var ModelReligion = require('model/religion');
	var ModelTargetedCity = require('model/targetedCity');
	var ModelFacebookLike = require('model/facebookLike');
	var NoInternetWindowModule = require('ui/handheld/Mn_NoInternetWindow');

	
	var numWaitingEvent = 0; 
	var currentUserId = -1;
	
	if(InstallTracking.isFirstTimeAppOpen()) {
		//redirect to the webview to get cookies
		Ti.Platform.openURL(Ti.App.API_SERVER + 'iOSAppInstalled?id='+Ti.Platform.id);
		InstallTracking.markAppOpen();
		Ti.App.LogSystem.logEntryInfo('First time opens app. (MacAddr: '+ Ti.Platform.id+')');
	}

	var currentDbVersion = ModelMetaData.getDbVersion();
	if(currentDbVersion === '') { //fresh install or version 1.0/1.1
		ModelMetaData.insertDbVersion(Ti.App.CLIENT_VERSION);
		//need to do the SQLite database migration
		ModelChatHistory.migrateData();
	} else {
		Ti.API.info('already have db version: ' + currentDbVersion);
		if(currentDbVersion !== Ti.App.CLIENT_VERSION) { 
			ModelChatHistory.migrateData();
			ModelMetaData.updateDbVersion(Ti.App.CLIENT_VERSION);
		}
	}

	//asking for geolocation
	Ti.App.Properties.setDouble('latitude', 0.0);
	Ti.App.Properties.setDouble('longitude', 0.0);
	Ti.Geolocation.purpose = L('geo_purpose');
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
		Ti.Geolocation.getCurrentPosition(function(e) {
			if(!e.error) {
				var latitude = e.coords.latitude;
				var longitude = e.coords.longitude;				
				Ti.App.Properties.setDouble('latitude', latitude);
				Ti.App.Properties.setDouble('longitude', longitude);
			}
		});
	}
		
	var openMainApplication = function(_userId, _userImage, _userName) {
		var MainApplicationModule = require('ui/handheld/ApplicationWindow');
		var mainApp = new MainApplicationModule(_userId, _userImage, _userName);
		mainApp.open();
		mainApp.unhideCoverView();
	};
	
	var loginProcessWindow = null;
	Ti.App.addEventListener('openMainApplication', function(e) {
		currentUserId = e.currentUserId;
		var currentUserImage = e.currentUserImage;
		var currentUserName = e.currentUserName;
		if(loginProcessWindow !== null) {
			Ti.API.info('loginProcessWindow is close...');
			loginProcessWindow.close();
			loginProcessWindow = null;
		}
		openMainApplication(currentUserId, currentUserImage, currentUserName);
	});
	
	Ti.App.addEventListener('doneWaitingEvent', function() {
		numWaitingEvent--;
		Ti.API.info('doneWaitingEvent listening, numWaitingEvent: '+numWaitingEvent);
		if(numWaitingEvent <= 0) {	
			// Android uses platform-specific properties to create windows.
			// All other platforms follow a similar UI pattern.
			if (osname === 'android') {
				//do nothing for now..Window = require('ui/handheld/android/ApplicationWindow');
			} else {
				//reset app badge number
				Ti.UI.iPhone.appBadge = null;
				UrbanAirship.resetBadge(UrbanAirship.getDeviceToken());
				if(Ti.App.Facebook.loggedIn) {
				//if(false) {
					var BackendUser = require('backend_libs/backendUser');
					var CreditSystem = require('internal_libs/creditSystem');
					BackendUser.getUserIdFromFbId(Ti.App.Facebook.uid, function(_userInfo) {
						if(_userInfo.success) {
							currentUserId = parseInt(_userInfo.meta.user_id);
							ServerRoutingSystem.selectServerAPI(currentUserId);
							var currentUserName = _userInfo.content.general.first_name; 
							var currentUserImage = _userInfo.content.pictures[0].src;
							
							var facebookLikeArray = [];
							for(var i = 0; i < _userInfo.content.likes.length; i++) {
								var likeObj = {
										'category': _userInfo.content.likes[i].category,
										'name': _userInfo.content.likes[i].name
									};
								facebookLikeArray.push(likeObj);
							}
							ModelFacebookLike.populateFacebookLike(currentUserId, currentUserId, facebookLikeArray);
								
							//set credit of the user
							CreditSystem.setUserCredit(_userInfo.content.credit); 
							
							openMainApplication(currentUserId, currentUserImage, currentUserName);
						}
					});
				} else {
					//open login page
					var LoginProcessWindowModule = require('ui/handheld/Li_LoginProcessWindow');
					loginProcessWindow = new LoginProcessWindowModule();			
					loginProcessWindow.open();
				}
			}
		}
	});
	
	//register Facebook Event here..pulling the data in TopFriendsView/OnBoardingStep1 [fn: FacebookQuery.queryFacebookFriends]
	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		//Ti.API.info('completedPhotoTagQuery...');
		FacebookFriendModel.updateClosenessScoreBatch(e.taggedFriends);
	});

	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		//Ti.API.info('completedPhotoTagQuery...');
		FacebookFriendModel.updateClosenessScoreBatch(e.taggedFriends);
	});
		
	Ti.App.addEventListener('completedUserPhotoQuery', function(e) {
		//Ti.API.info('completedUserPhotoQuery...');
		FacebookQuery.queryUserPhotoTags(e.userFbPhotoIds);
	});
	
/*	-- not asking for read stream anymore
	Ti.App.addEventListener('completedUserLikeQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.friendsWhoLikeList);
	});
	
	Ti.App.addEventListener('completedUserCommentQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.friendsWhoCommentList);
	});
		
	Ti.App.addEventListener('completedUserStreamQuery', function(e) {
		FacebookQuery.queryUserLikes(e.userStreamIdList);
		FacebookQuery.queryUserComments(e.userStreamIdList);
		//query likes, comments, photo albums
	});
*/
	
	Ti.App.addEventListener('userLoginCompleted', function(e) {
		//Ti.API.info('updating currentUserId from the logging in process..:' + e.userId);
		currentUserId = e.userId;
	});
	
	Ti.App.addEventListener('completedFacebookFriendQuery', function(e) {
		var candidateList = e.candidateList;
		//Ti.API.info('completedFacebookFriendQuery: candidateList: '+JSON.stringify(candidateList));
		FacebookFriendModel.populateFacebookFriend(candidateList);

		BackendInvite.getInvitedList(currentUserId, function(e) {
			//update the local db for invitedList
			if(e.success) {
				var invitedList = e.content.invited_people;
				FacebookFriendModel.updateIsInvited(invitedList);
			} else {
				var networkErrorDialog = Titanium.UI.createAlertDialog({
					title: L('Oops!'),
					message:L('There is something wrong. Please close and open Noonswoon again.'),
					buttonNames: [L('Ok')],
					cancel: 0
				});
				if(CacheHelper.shouldDisplayOopAlert()) {
					CacheHelper.recordDisplayOopAlert();
					networkErrorDialog.show();	
				}
			}
		});
		
		FacebookQuery.queryUserPhotos();
		
		//query some read stream and get the comments/like -- get rid off since we won't ask for the permission
		//FacebookQuery.queryUserStream(); //-- get rid off since we won't ask for the permission
	});
	
	Ti.App.Facebook.addEventListener('logout', function() {
		var LoginProcessWindowModule = require('ui/handheld/Li_LoginProcessWindow');
		var loginProcessWindow = new LoginProcessWindowModule();			
		loginProcessWindow.open();
	});
	
	//pull static data from server
	var noInternetWindow = null;
	var errorWindow = null;
	var launchTheApp = function() {
		numWaitingEvent++;

		if(CacheHelper.shouldFetchData('StaticData', 0)) {
			BackendGeneralInfo.getStaticData(function(e) {
				if(e.success) {
					Ti.API.info('result from getStaticData: '+JSON.stringify(e));
					//load data into religion table
					ModelReligion.populateReligion(e.content.religion);
					ModelEthnicity.populateEthnicity(e.content.ethnicity);
					ModelTargetedCity.populateTargetedCity(e.content.city);
	
					Ti.App.NUM_INVITE_ALL = e.content.invites_signup; 
					Ti.App.Properties.setInt('invitesSignup',Ti.App.NUM_INVITE_ALL);
					Ti.App.OFFERED_CITIES = e.content.city;  //need to put this guy in the db

					CacheHelper.recordFetchedData('StaticData'); //no need to fetch again
				} else {
					var networkErrorDialog = Titanium.UI.createAlertDialog({
						title: L('Oops!'),
						message:L('There is something wrong. Please close and open Noonswoon again.'),
						buttonNames: [L('Ok')],
						cancel: 0
					});
					if(CacheHelper.shouldDisplayOopAlert()) {
						CacheHelper.recordDisplayOopAlert();
						networkErrorDialog.show();
					}
				}
				Ti.App.fireEvent('doneWaitingEvent');
			});
		} else {
			if(Ti.App.Properties.hasProperty('invitesSignup')) {
				Ti.App.NUM_INVITE_ALL = Ti.App.Properties.getInt('invitesSignup');			
			} else {
				Ti.App.NUM_INVITE_ALL = 5;
			}
			Ti.App.OFFERED_CITIES = ModelTargetedCity.getTargetedCity();
			Ti.App.fireEvent('doneWaitingEvent');
		}
	};
	
	var launchTheAppWrapper = function() {
		Ti.API.info('try to launch the app again...');
		if(Ti.Network.networkType != Ti.Network.NETWORK_NONE) {
			launchTheApp();
			if(noInternetWindow !== null) {
				noInternetWindow.close();
				noInternetWindow = null;
			}
			if(errorWindow !== null) {
				errorWindow.close();
				errorWindow = null;
			}
		}
	};

	Ti.App.addEventListener('restartApp', launchTheAppWrapper);
	
	Ti.App.addEventListener('openErrorWindow', function(e) {
		//somehow need to find a way to log this to the server		
		//Ti.API.info('openErrorWindow param: '+JSON.stringify(e));
		Ti.App.LogSystem.logSystemData('warn', e.src + ', ErrorWindow is open: ' + e.meta.description, currentUserId, null);
		
		var displayError = '';
		if(e.meta.display_error !== undefined)
			displayError = e.meta.display_error;

		errorWindow = new ErrorWindowModule(displayError, currentUserId);
		errorWindow.open();
	});

	Ti.App.addEventListener('openNoInternetWindow', function(e) {
		noInternetWindow = new NoInternetWindowModule();
		noInternetWindow.open();
	});
			
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
		Ti.App.fireEvent('openNoInternetWindow');
	} else {					
		//Ti.App.fireEvent('openErrorWindow', {src: 'dummy', meta: {description: 'test' }});
		launchTheApp();
	} 
})();