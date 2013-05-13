function LoginProcessWindow() {
    var LoginOnBoardingModule = require('ui/handheld/Mn_LoginOnBoardingWindow');	

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
	
	var openOnboardingStep1Callback = function(e) {
		var OnBoardingStep1Module = require('ui/handheld/Mn_OnBoardingStep1Window');
		var onBoardingStep1Window = new OnBoardingStep1Module(e.userId);
		navigationGroup.open(onBoardingStep1Window, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingStep1', openOnboardingStep1Callback);
	
	var openOnboardingEditStepCallback = function(e) {
		var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
		var editProfileWindow = new EditProfileWindowModule(navigationGroup, e.userId, true);
		navigationGroup.open(editProfileWindow, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingEditStep', openOnboardingEditStepCallback); 
	
	var openOnboardingStep2Callback = function(e) {
		var OnBoardingStep2Module = require('ui/handheld/Mn_OnBoardingStep2Window');
		var onBoardingStep2Window = new OnBoardingStep2Module(e.userId);
		navigationGroup.open(onBoardingStep2Window, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingStep2', openOnboardingStep2Callback);

	var openOnboardingInviteStepCallback = function(e) {
		var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');		
		var inviteFriendWindow = new InviteFriendWindowModule(navigationGroup, e.userId, true);
		navigationGroup.open(inviteFriendWindow, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingInviteStep', openOnboardingInviteStepCallback);

	var openOnboardingStep3Callback = function(e) {
		var OnBoardingStep3Module = require('ui/handheld/Mn_OnBoardingStep3Window');
		var onBoardingStep3Window = new OnBoardingStep3Module(e.userId);
		navigationGroup.open(onBoardingStep3Window, {animated:true});
	};
	Ti.App.addEventListener('openOnboardingStep3', openOnboardingStep3Callback);

    return self;
};
//animation stuff example
//		editProfileWindow.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL, 
//											modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});

module.exports = LoginProcessWindow;