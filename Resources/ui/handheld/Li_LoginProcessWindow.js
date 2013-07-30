function LoginProcessWindow() {
    var LoginOnBoardingModule = require('ui/handheld/Mn_LoginOnBoardingWindow');	
	var OnBoardingStep1Module = require('ui/handheld/Mn_OnBoardingStep1Window');
	var OnBoardingStep2Module = require('ui/handheld/Mn_OnBoardingStep2Window');
	var OnBoardingStep3Module = require('ui/handheld/Mn_OnBoardingStep3Window');
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');		
			
    //create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		zIndex: 1,
		backgroundColor:'transparent',
		width: 320
	});

	var loginOnBoardingWindow = new LoginOnBoardingModule(self);
	
	var navigationGroup = Titanium.UI.iPhone.createNavigationGroup({
	  	window: loginOnBoardingWindow,
	  	left: 0,
	  	width: Ti.Platform.displayCaps.platformWidth,
	});
	loginOnBoardingWindow.setNavGroup(navigationGroup);
    
	self.add(navigationGroup);
	var onBoardingStep1Window = null;
	var onBoardingStep2Window = null;
	var onBoardingStep3Window = null;
	var editProfileWindow = null;
	var inviteFriendWindow = null;
	
	var openOnboardingStep1Callback = function(e) {
		if(Ti.App.isTrackingOn) {
			Ti.Platform.openURL(Ti.App.API_SERVER + 'iOSUserRegistered?id='+Ti.Platform.id);
		}
		onBoardingStep1Window = new OnBoardingStep1Module(e.userId);
		navigationGroup.open(onBoardingStep1Window, {animated:true});
		Ti.App.LogSystem.logSystemData('info', 'User registered.', e.userId, Ti.App.Facebook.uid);	
	};
	Ti.App.addEventListener('openOnboardingStep1', openOnboardingStep1Callback);
	
	var openOnboardingEditStepCallback = function(e) {
		editProfileWindow = new EditProfileWindowModule(navigationGroup, e.userId, true);
		navigationGroup.open(editProfileWindow, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingEditStep', openOnboardingEditStepCallback); 
	
	var openOnboardingStep2Callback = function(e) {
		onBoardingStep2Window = new OnBoardingStep2Module(e.userId);
		navigationGroup.open(onBoardingStep2Window, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingStep2', openOnboardingStep2Callback);

	var openOnboardingInviteStepCallback = function(e) {
		inviteFriendWindow = new InviteFriendWindowModule(navigationGroup, e.userId, true);
		navigationGroup.open(inviteFriendWindow, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingInviteStep', openOnboardingInviteStepCallback);

	var openOnboardingStep3Callback = function(e) {
		onBoardingStep3Window = new OnBoardingStep3Module(e.userId);
		navigationGroup.open(onBoardingStep3Window, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingStep3', openOnboardingStep3Callback);
	
	var loginProcessWindowCloseCallback = function() {
		if(onBoardingStep1Window !== null) 
			navigationGroup.close(onBoardingStep1Window);
			
		if(onBoardingStep2Window !== null) 
			navigationGroup.close(onBoardingStep2Window);
			
		if(onBoardingStep3Window !== null) 
			navigationGroup.close(onBoardingStep3Window);
					
		if(editProfileWindow !== null)
			navigationGroup.close(editProfileWindow);
		
		if(inviteFriendWindow !== null) 
			navigationGroup.close(inviteFriendWindow);

		Ti.App.removeEventListener('openOnboardingStep1',openOnboardingStep1Callback);
		Ti.App.removeEventListener('openOnboardingStep2',openOnboardingStep2Callback);
		Ti.App.removeEventListener('openOnboardingStep3',openOnboardingStep3Callback);
		Ti.App.removeEventListener('openOnboardingEditStep',openOnboardingEditStepCallback);
		Ti.App.removeEventListener('openOnboardingInviteStep',openOnboardingInviteStepCallback);
		Ti.API.info('loginProcessWindow close..removing all the eventListener');
	};
	self.addEventListener('close', loginProcessWindowCloseCallback);
		

    return self;
};
//animation stuff example
//		editProfileWindow.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
//											modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});

module.exports = LoginProcessWindow;