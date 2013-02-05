OnBoardingStep1Window = function(_navGroup, _userId) {
	
	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var FacebookFriendModel = require('model/facebookFriend');
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
		text: 'Personalize',
		center: {x:'50%', y:246}, //x:70
		color: '#80868e',
		font:{fontWeight:'bold',fontSize:36},
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: 'View and edit your profile',
		center: {x:'50%', y:293}, //x:88
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description1Lbl);
	
	var description2Lbl = Ti.UI.createLabel({
		text: 'and put yourself in the best light!',
		center: {x:'50%', y:313}, //x:67
		color: '#a6a9ae',
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(description2Lbl);
	
	var viewProfileBtn = Ti.UI.createButton({
		title: 'View my profile',
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
		_navGroup.open(editProfileWindow);
	});
	
	//pull facebook data here
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
	
	Ti.App.addEventListener('completedFacebookFriendQuery', function(e) {
		var candidateList = e.candidateList;
		
		FacebookFriendModel.populateFacebookFriend(candidateList);
		BackendInvite.getInvitedList(_userId, function(invitedList) {
			//update the local db for invitedList
			FacebookFriendModel.updateIsInvited(invitedList);
		});
		
		//query some read stream and get the comments/like
		FacebookQuery.queryUserStream();
	});
	
	if(!CacheHelper.isFetchedData('FacebookFriendQuery_'+Ti.Facebook.uid)) {
		CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.Facebook.uid); //no need to fetch again
		FacebookQuery.queryFacebookFriends();	
	} 
	
	return self;
};

module.exports = OnBoardingStep1Window;
