// TODO: 
/*
 * - work on the cartoon chat
 * - work on caching the Facebook edit photo
 * - work on Facebook signup button when the user doesn't login at first
 * - push notification
 */

/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//GLOBAL VARIABLES DECARATION
Ti.App.API_SERVER = "http://noonswoon.apphb.com/";
Ti.App.API_ACCESS = "n00nsw00n:he1p$1ngle";

Ti.App.DATABASE_NAME = "Noonswoon";

Ti.App.LIKE_CREDITS_SPENT = 10;
Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT = 5;

Ti.App.NUM_TOP_FRIENDS = 5; 

Ti.App.NUM_INVITE_ALL = 10;

Ti.App.IS_ON_DEVICE = true;
Ti.App.IS_PRODUCTION_BUILD = false;
Ti.App.ACTUAL_FB_INVITE = true;

Ti.App.ACS_API_KEY = 'Gncin2EPt9KCUYCuWehXHI6EdojdrdF6';
if(Ti.App.IS_PRODUCTION_BUILD)
	Ti.App.ACS_API_KEY = 'zBKsqQRa9SgyPQQsdmOnvCBbNkSKRSs8';

Ti.App.CACHE_TIMEOUT = 1;

Ti.App.BACKGROUND_BAR_COLOR_THEME = '#3f5a95';
Ti.App.LIVE_DATA = true;

Ti.Facebook.appid = "132344853587370";
Ti.Facebook.permissions = [	'email', 'user_education_history', 'user_location', 'user_birthday',
							'user_religion_politics', 'user_work_history', 'user_photos', 
							'user_about_me', 'friends_location', 'friends_relationships, read_stream'];
Ti.Facebook.forceDialogAuth = true; //fb sso not working on actual device

//include require
if(Ti.Platform.osname == 'iphone') {
	Ti.include('external_libs/TiPreloader.js');
	Ti.include('external_libs/cacheFromRemote.js');
} else {
	Ti.include('/Resources/external_libs/TiPreloader.js');
	Ti.include('/Resources/external_libs/cacheFromRemote.js');
}

Ti.App.moment = require('external_libs/moment');
var acs = require('external_libs/acs');
var UrbanAirship = require('external_libs/UrbanAirship');

var Debug = require('internal_libs/debug');
var CacheHelper = require('internal_libs/cacheHelper');
var FacebookQuery = require('internal_libs/facebookQuery');

var FacebookFriendModel = require('model/facebookFriend');

var BackendInvite = require('backend_libs/backendInvite');

/* fql: SELECT 
uid,name, relationship_status, current_location 
FROM user 
WHERE 
uid IN (SELECT uid2 FROM friend WHERE uid1 = me())
*/

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
	
	var BackendGeneralInfo = require('backend_libs/backendGeneralInfo');
	var ModelEthnicity = require('model/ethnicity');
	var ModelReligion = require('model/religion');
	var ModelTargetedCity = require('model/targetedCity');
	var ModelFacebookLike = require('model/facebookLike');
	var NoInternetWindowModule = require('ui/handheld/Mn_NoInternetWindow');
	var ErrorWindowModule = require('ui/handheld/Mn_ErrorWindow');
	var RateReminder = require('internal_libs/rateReminder');
	
	var numWaitingEvent = 0; 
	var currentUserId = -1;
	
	Ti.App.addEventListener('doneWaitingEvent', function() {
		numWaitingEvent--;
		Ti.API.info('doneWaitingEvent listening, numWaitingEvent: '+numWaitingEvent);
		if(numWaitingEvent <= 0) {	
			if (isTablet) {
				Window = require('ui/tablet/ApplicationWindow');
			} else {
				// Android uses platform-specific properties to create windows.
				// All other platforms follow a similar UI pattern.
				if (osname === 'android') {
					Window = require('ui/handheld/android/ApplicationWindow');
				}
				else {
					//reset app badge number
					Ti.UI.iPhone.appBadge = null;
					if(Ti.Facebook.loggedIn) {
					//if(false) {
						var BackendUser = require('backend_libs/backendUser');
						var CreditSystem = require('internal_libs/creditSystem');
						BackendUser.getUserIdFromFbId(Ti.Facebook.uid, function(_userInfo) {	
							currentUserId = parseInt(_userInfo.meta.user_id); 
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
							//getting real data
							var MainApplicationModule = require('ui/handheld/ApplicationWindow');
							var mainApp = new MainApplicationModule(currentUserId, currentUserImage);
							mainApp.open();
							mainApp.unhideCoverView();
						});
					} else {
						//open login page
						var LoginProcessWindowModule = require('ui/handheld/Li_LoginProcessWindow');
						var loginProcessWindow = new LoginProcessWindowModule();			
						loginProcessWindow.open();
					}
				}
			}
		}
	});
	
	//register Facebook Event here..pulling the data in TopFriendsView/OnBoardingStep1 [fn: FacebookQuery.queryFacebookFriends]
	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.taggedFriends);
	});
	
	Ti.App.addEventListener('completedUserPhotoQuery', function(e) {
		FacebookQuery.queryUserPhotoTags(e.userFbPhotoIds);
	});
	
	Ti.App.addEventListener('completedUserLikeQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.friendsWhoLikeList);
	});
	
	Ti.App.addEventListener('completedUserCommentQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.friendsWhoCommentList);
	});
	
	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		FacebookFriendModel.updateClosenessScoreBatch(e.taggedFriends);
	});
	
	Ti.App.addEventListener('completedUserStreamQuery', function(e) {
		FacebookQuery.queryUserLikes(e.userStreamIdList);
		FacebookQuery.queryUserComments(e.userStreamIdList);
		FacebookQuery.queryUserPhotos();
		//query likes, comments, photo albums
	});
	
	Ti.App.addEventListener('userLoginCompleted', function(e) {
		Ti.API.info('updating currentUserId from the logging in process..:' + e.userId);
		currentUserId = e.userId;
	});
	
	Ti.App.addEventListener('completedFacebookFriendQuery', function(e) {
		var candidateList = e.candidateList;
		
		Ti.API.info('candidateList: '+JSON.stringify(candidateList));
		FacebookFriendModel.populateFacebookFriend(candidateList);
		Ti.API.info('calling Backend: getInvitedList of userId: '+currentUserId);
		BackendInvite.getInvitedList(currentUserId, function(invitedList) {
			//update the local db for invitedList
			FacebookFriendModel.updateIsInvited(invitedList);
		});
		
		//query some read stream and get the comments/like
		FacebookQuery.queryUserStream();
	});
	
	Ti.Facebook.addEventListener('logout', function() {
		var LoginProcessWindowModule = require('ui/handheld/Li_LoginProcessWindow');
		var loginProcessWindow = new LoginProcessWindowModule();			
		loginProcessWindow.open();
	});
	
	//pull static data from server
	var noInternetWindow = null;
	var errorWindow = null;
	var launchTheApp = function() {
		numWaitingEvent++;
		RateReminder.checkReminderToRate();

		if(CacheHelper.shouldFetchData('StaticData', 0)) {
			CacheHelper.recordFetchedData('StaticData'); //no need to fetch again
			BackendGeneralInfo.getStaticData(function(e) {
				//load data into religion table
				ModelReligion.populateReligion(e.religion);
				ModelEthnicity.populateEthnicity(e.ethnicity);
				ModelTargetedCity.populateTargetedCity(e.city);
				
				Ti.App.OFFERED_CITIES = e.city;  //need to put this guy in the db
				Ti.API.info('pull data offered city: '+JSON.stringify(Ti.App.OFFERED_CITIES));
				Ti.App.fireEvent('doneWaitingEvent');
			});
		} else {
			Ti.App.OFFERED_CITIES = ModelTargetedCity.getTargetedCity();
			Ti.API.info('db data offered city: '+JSON.stringify(Ti.App.OFFERED_CITIES));
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
	
	Ti.App.addEventListener('openErrorWindow', function() {
		errorWindow = new ErrorWindowModule();
		errorWindow.open();
	});
	
	
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
		noInternetWindow = new NoInternetWindowModule();
		noInternetWindow.open();
	} else {
		launchTheApp();
	} 
	
})();
