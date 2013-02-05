//This is the row in the match screen

MutualFriendsTableViewRow = function(_fieldName, _content, _hasUnlocked) {
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendCredit = require('backend_libs/backendCredit');
	var BackendMatch = require('backend_libs/backendMatch');
	
	var fieldName = _fieldName; 
	var hasUnlocked = _hasUnlocked;
	var userId = _content['userId']; 
	var matchId = _content['matchId'];
	var mutualFriendsArray = _content['mutualFriendsArray'];
	var numMutualFriends = mutualFriendsArray.length;
	
	
	var tableRow = Ti.UI.createTableViewRow({
		width: 320,
		height: 47,
		backgroundImage: 'images/show-more.png',
		zIndex: 0,
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var activeImageView = Ti.UI.createImageView({
		top: 0,
		left: 0,
		width: 320, 
		height: 47, 
		backgroundImage: 'images/show-more-active.png',
		zIndex: 1,
		visible: false,
	});
	tableRow.add(activeImageView);
	
	var pluralized = 's';
	if(numMutualFriends === 1) pluralized = ''; 

	var mutualFriendsLabel = Ti.UI.createLabel({
		text: numMutualFriends + ' mutual friend'+pluralized,
		color: '#7c838b',
		center: {x:'50%', y:'52%'},
		font: {fontSize: 12, fontWeight: 'bold'},
		zIndex: 2,
	});
	tableRow.add(mutualFriendsLabel);

	var insufficientCreditsDialog = Titanium.UI.createAlertDialog({
		title:'Not enough credits',
		message:'Get credits by inviting your friends to Noonswoon!',
		buttonNames: ['Ok'],
	});
	
	var mutualFriendsDialog = Titanium.UI.createAlertDialog({
		title:'Reveal Mutual Friends',
		message:'5 credits will be deducted from your account for this action',
		buttonNames: ['Cancel','Use credits'],
		cancel: 0
	});
	
	mutualFriendsDialog.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'android' && mutualFriendsDialog.buttonNames === null) {
			Ti.API.info('(There was no button to click)');
		} else {
			if(e.index === 1) {
			//need to check if have enough points, deduct points, update show_mutual_friends
				var userCredit = CreditSystem.getUserCredit();
				if(userCredit < Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT) {
					insufficientCreditsDialog.show();
				} else {
					BackendCredit.transaction({userId:userId, amount: (-1)*Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT, action:'mutual_friend'}, function(_currentCredit){
						CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
					});
							
					//update show_mutual_friends
					BackendMatch.updateDisplayMutualFriend({matchId: matchId, userId:userId}, function(e) {
						if(e.success) Ti.API.info('update mutual friends success');
						else Ti.API.info('update mutual friends failed');
					});
					
					hasUnlocked = true;
					//open up the window to show friends
					Ti.App.fireEvent('openMutualFriendsWindow', {mutualFriendsArray: mutualFriendsArray});
				}
			}
		}
	});			
	
	tableRow.addEventListener('touchstart', function(){
		activeImageView.visible = true;
	});
	
	tableRow.addEventListener('touchend', function(){
		activeImageView.visible = false;
		if(!hasUnlocked) {
			mutualFriendsDialog.show();
		} else {
			Ti.App.fireEvent('openMutualFriendsWindow', {mutualFriendsArray: mutualFriendsArray});
		}
	});	

	tableRow.getFieldName = function() {
		return fieldName;
	};

	return tableRow;
};

module.exports = MutualFriendsTableViewRow;