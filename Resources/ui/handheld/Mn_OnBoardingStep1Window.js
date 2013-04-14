OnBoardingStep1Window = function(_navGroup, _userId) {
	Ti.App.Flurry.logEvent('after-signup-onboard-1-pre-edit');
	
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var FacebookQuery = require('internal_libs/facebookQuery');
    var CacheHelper = require('internal_libs/cacheHelper');
    var BackendInvite = require('backend_libs/backendInvite');
    
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
	});
	
	var backgroundView = Ti.UI.createImageView({
		image: 'images/post-onboarding-1.png',
		top: 0,
		left: 0,
		zIndex: 1,
	});
	self.add(backgroundView);
				
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('Personalize'),
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
		zIndex: 2,
	});
	self.add(headlineLbl); 
	
	var description1Lbl = Ti.UI.createLabel({
		text: L('Show your best side!'),
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 2,
	});
	self.add(description1Lbl);
	
	var viewProfileButton = Ti.UI.createButton({
		width: 250, 
		height: 50,
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		zIndex: 2,
	})
	
	var viewProfileButtonText = Ti.UI.createLabel({
		text: L('Update your profile'),
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 2,
	});
	viewProfileButton.add(viewProfileButtonText);
	
	self.add(viewProfileButton);
	
	viewProfileButton.addEventListener('click', function() {
		var editProfileWindow = new EditProfileWindowModule(_navGroup, _userId, true);
		editProfileWindow.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
											modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});
		//self.close();
		//_navGroup.open(editProfileWindow, { modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
		//									modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});
	});
	
	if(CacheHelper.shouldFetchData('FacebookFriendQuery_'+Ti.App.Facebook.uid, 0)) {
		CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.App.Facebook.uid); //no need to fetch again
		FacebookQuery.queryFacebookFriends();	
	} 
	
	return self;
};

module.exports = OnBoardingStep1Window;

