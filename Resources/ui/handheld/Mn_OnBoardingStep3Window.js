OnBoardingStep3Window = function(_navGroup, _userId) {
	Ti.App.Flurry.logEvent('after-signup-onboard-3-pre-cartoon');
	
	//create component instance
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		barImage: 'images/top-bar-stretchable.png',
		backgroundImage: 'images/post-onboarding-3.png'
	});
				
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: 'Finding match',
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: 'You\'re all set! Your first match will',
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: 'be available soon!',
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description2Lbl);
	
	var buttton = Ti.UI.createButton({
		title: 'Done',
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:395}, //x:67
		color: '#727171',
		font:{fontWeight:'bold',fontSize:18},
		width: 250, 
		height: 50
	})
	self.add(buttton);
	
	buttton.addEventListener('click', function() {
		var BackendUser = require('backend_libs/backendUser');
		var CreditSystem = require('internal_libs/creditSystem');
		var ModelFacebookLike = require('model/facebookLike');
		
		BackendUser.getUserIdFromFbId(Ti.Facebook.uid, function(_userInfo) {	
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
			var currentUserImage = _userInfo.content.pictures[0].src;
			var ApplicationWindowModule = require('ui/handheld/ApplicationWindow');
			var mainApp = new ApplicationWindowModule(currentUserId, currentUserImage);
			mainApp.open();
			mainApp.unhideCoverView();
			
			//self.close();
		});		
	});
	return self;
};

module.exports = OnBoardingStep3Window;

