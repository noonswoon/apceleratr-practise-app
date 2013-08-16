//This is the row in the match screen

MutualFriendsTableViewRow = function(_fieldName, _content, _hasUnlocked, _isLatestMatch) {
	var CreditSystem = require('internal_libs/creditSystem');
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
	
	var pluralized = L('s');
	if(numMutualFriends === 1) pluralized = ''; 

	var mutualFriendsLabel = Ti.UI.createLabel({
		text: String.format(L('x mutual friend'), (numMutualFriends+"")) + pluralized,
		color: '#7c838b',
		center: {x:'50%', y:'52%'},
		font: {fontSize: 12, fontWeight: 'bold'},
		zIndex: 2,
	});
	tableRow.add(mutualFriendsLabel);

	tableRow.addEventListener('touchstart', function(){
		activeImageView.visible = true;
	});
	
	tableRow.addEventListener('touchcancel', function(){
		activeImageView.visible = false;
	});
	
	var isMutualFriendsWindowOpen = false; //prevent duplicate event
	tableRow.addEventListener('touchend', function(){
		activeImageView.visible = false;

		if(!hasUnlocked) {
			var userCredit = CreditSystem.getUserCredit();
			if(userCredit < Ti.App.UNLOCK_MUTUAL_FRIEND_CREDITS_SPENT && Ti.App.CUSTOMER_TYPE === 'regular') {
				var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
					title: L('You have '+userCredit+' credits'),
					message: L('You need 5 credits to reveal \'Mutual Friends\'. Invite friends or buy more credits.'),
					buttonNames: [L('Ok')],
				});
				notEnoughCreditsDialog.show();
				
				Ti.App.GATracker.trackEvent({
					category: "Match",
					action: "MutualFriendReveal",
					label: "Not enough credit",
					value: 1
				});
			} else {							
				//update show_mutual_friends
				//Ti.API.info('trying to open the MutualFriendsWindow..');
				if(!isMutualFriendsWindowOpen) {
					isMutualFriendsWindowOpen = true;
					//Ti.API.info('set isMutualFriendsWindowOpen = true');
					BackendMatch.updateDisplayMutualFriend({matchId: matchId, userId:userId}, function(e) {
						if(e.success) {
							
							Ti.App.GATracker.trackEvent({
								category: "Match",
								action: "MutualFriendReveal",
								label: "reveal succeeded",
								value: 1
							});
							
							Ti.App.CUSTOMER_TYPE = e.content.customer_type;
							CreditSystem.setUserCredit(e.content.credit); //sync the credit
							hasUnlocked = true;
						
							//open up the window to show friends, should show just once
							Ti.App.fireEvent('openMutualFriendsWindow', {mutualFriendsArray: mutualFriendsArray, isLatestMatch: _isLatestMatch});
						} else {
							//either no credits to use or NO longer has the subscription
							if(e.content !== undefined && e.content.customer_type !== undefined) 
								Ti.App.CUSTOMER_TYPE = e.content.customer_type;
							
							if(e.content !== undefined && e.content.credit !== undefined) {
								CreditSystem.setUserCredit(e.content.credit); //sync the credit
								var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
									title: L('You have '+e.content.credit+' credits'),
									message: L('You need 5 credits to reveal \'Mutual Friends\'. Invite friends or buy more credits.'),
									buttonNames: [L('Ok')],
								});
								notEnoughCreditsDialog.show();
							}
							isMutualFriendsWindowOpen = false;
							hasUnlocked = false;
							
							Ti.App.GATracker.trackEvent({
								category: "Match",
								action: "MutualFriendReveal",
								label: "reveal failed (90% coz not enough credits)",
								value: 1
							});
						}
					});
				}
			}
		} else {
			//open up the window to show friends, should show just once
			if(!isMutualFriendsWindowOpen) {
				//Ti.API.info('set isMutualFriendsWindowOpen = true');
				isMutualFriendsWindowOpen = true;
				Ti.App.fireEvent('openMutualFriendsWindow', {mutualFriendsArray: mutualFriendsArray, isLatestMatch: _isLatestMatch});
			}
		}
	});	

	tableRow.mutualFriendsWindowIsClose = function() {
		//Ti.API.info('set isMutualFriendsWindowOpen = false');
		isMutualFriendsWindowOpen = false;
	};
	
	tableRow.getFieldName = function() {
		return fieldName;
	};

	return tableRow;
};

module.exports = MutualFriendsTableViewRow;
