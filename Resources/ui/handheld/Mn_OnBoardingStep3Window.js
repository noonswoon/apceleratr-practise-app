OnBoardingStep3Window = function(_userId) {
	Ti.App.NSAnalytics.trackScreen("OnboardingStep3Screen");
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
	});
	
	var backgroundView = Ti.UI.createImageView({
		image: 'images/post-onboarding-3.png',
		top: 0,
		left: 0,
		zIndex: 1,
	});
	self.add(backgroundView);
					
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('Congrats!'),
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
		zIndex: 2,
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('You will be receiving a new match'),
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 2,
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: L('every day at noon'),
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 2,
	});
	self.add(description2Lbl);
	
	var button = Ti.UI.createButton({
		width: 250, 
		height: 50,
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		zIndex: 2,
	});
	
	var buttonText = Ti.UI.createLabel({
		text: L('Love is in the App'),
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 2,
	});
	button.add(buttonText);
	
	self.add(button);
	
	button.addEventListener('click', function() {
		var BackendUser = require('backend_libs/backendUser');
		var CreditSystem = require('internal_libs/creditSystem');
		var ModelFacebookLike = require('model/facebookLike');
		
		BackendUser.getUserIdFromFbId(Ti.App.Facebook.uid, function(_userInfo) {	
			if(_userInfo.success) {
				var facebookLikeArray = [];
				for(var i = 0; i < _userInfo.content.likes.length; i++) {
					var likeObj = {
						'category': _userInfo.content.likes[i].category,
						'name': _userInfo.content.likes[i].name
					};
					facebookLikeArray.push(likeObj);
				}
				ModelFacebookLike.populateFacebookLike(parseInt(_userInfo.meta.user_id), parseInt(_userInfo.meta.user_id), facebookLikeArray);
				
				//set credit of the user
				CreditSystem.setUserCredit(_userInfo.content.credit); 
	
				var currentUserId = parseInt(_userInfo.meta.user_id); 
				var currentUserName = _userInfo.content.general.first_name;
				var currentUserImage = _userInfo.content.pictures[0].src;
				
				Ti.App.fireEvent('openMainApplication', {currentUserId: currentUserId, currentUserImage: currentUserImage, currentUserName: currentUserName});
			}
		});		
	});
	return self;
};

module.exports = OnBoardingStep3Window;
