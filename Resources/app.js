// tasks: get the credit system to work 'Reveal Mutual Friends'
//get the sign up flow to work (force invited)

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

//GLOBAL VARIABLES DECARATION
Ti.App.API_SERVER = "http://noonswoon.apphb.com/";
Ti.App.API_ACCESS = "n00nsw00n:he1p$1ngle";

Ti.App.DATABASE_NAME = "Noonswoon";

Ti.App.LIKE_CREDITS_SPENT = 10;
Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT = 5;

Ti.App.NUM_TOP_FRIENDS = 5; 

Ti.App.NUM_INVITE_ALL = 10;

Ti.App.IS_ON_DEVICE = false;
Ti.App.IS_PRODUCTION_BUILD = false;
Ti.App.ACTUAL_FB_INVITE = false;

Ti.App.ACS_API_KEY = 'Gncin2EPt9KCUYCuWehXHI6EdojdrdF6';
if(Ti.App.IS_PRODUCTION_BUILD)
	Ti.App.ACS_API_KEY = 'zBKsqQRa9SgyPQQsdmOnvCBbNkSKRSs8';

Ti.App.CACHE_TIMEOUT = 1;

Ti.App.BACKGROUND_BAR_COLOR_THEME = '#3f5a95';
Ti.App.LIVE_DATA = true;

/* fql: SELECT 
uid,name, relationship_status, current_location 
FROM user 
WHERE 
uid IN (SELECT uid2 FROM friend WHERE uid1 = me())
*/

Ti.Facebook.appid = "132344853587370";
Ti.Facebook.permissions = [	'email', 'user_education_history', 'user_location', 
							'user_religion_politics', 'user_work_history', 'user_photos', 
							'user_about_me', 'friends_location', 'friends_relationships'];
Ti.Facebook.forceDialogAuth = true; //fb sso not working on actual device

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
	
	var numWaitingEvent = 0; 
		
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
							//set credit of the user
							CreditSystem.setUserCredit(_userInfo.content.credit); 
							//getting real data
							var MainApplicationModule = require('ui/handheld/ApplicationWindow');
							var mainApp = new MainApplicationModule(_userInfo.meta.user_id);
							mainApp.open();
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
	
		//pull static data from server
	numWaitingEvent++;
	BackendGeneralInfo.getReligion(function(e) {
		//load data into religion table
		//Ti.API.info('religion data: '+JSON.stringify(e));
		ModelReligion.populateReligion(e);
		Ti.App.fireEvent('doneWaitingEvent');
	});
	
	numWaitingEvent++;
	BackendGeneralInfo.getEthnicity(function(e) {
		//load data into ethnicity table
		//Ti.API.info('ethnicity data: '+JSON.stringify(e));
		ModelEthnicity.populateEthnicity(e);
		Ti.App.fireEvent('doneWaitingEvent');
	});
	
	numWaitingEvent++;
	BackendGeneralInfo.getTargetedCity(function(e) {
		Ti.App.OFFERED_CITIES = e;
		Ti.App.fireEvent('doneWaitingEvent');
	});
		
})();
