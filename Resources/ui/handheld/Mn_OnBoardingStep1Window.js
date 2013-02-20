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
		backgroundImage: 'images/post-onboarding-1.png'
	});
				
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('Personalize'),
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('View and edit your profile'),
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: L('and put yourself in the best light!'),
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description2Lbl);
	
	var viewProfileBtn = Ti.UI.createButton({
		title: L('View my profile'),
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		width: 250, 
		height: 50
	})
	self.add(viewProfileBtn);
	
	viewProfileBtn.addEventListener('click', function() {
		var editProfileWindow = new EditProfileWindowModule(_navGroup, _userId, true);
		editProfileWindow.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
											modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});
		//self.close();
		//_navGroup.open(editProfileWindow, { modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
		//									modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});
	});
	
	if(CacheHelper.shouldFetchData('FacebookFriendQuery_'+Ti.Facebook.uid, 0)) {
		CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.Facebook.uid); //no need to fetch again
		FacebookQuery.queryFacebookFriends();	
	} 
	
	return self;
};

module.exports = OnBoardingStep1Window;

