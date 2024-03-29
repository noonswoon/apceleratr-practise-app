InviteFriendWindow = function(_navGroup, _userId, _forcedInvite) {
	Ti.App.NSAnalytics.trackScreen("InviteFriendScreen");
	var EmptyTableViewRow = require('ui/handheld/Mn_EmptyTableViewRow');
	
	var FacebookSharing = require('internal_libs/facebookSharing');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendInvite = require('backend_libs/backendInvite');
	var FacebookFriend = require('model/facebookFriend');

	var FacebookFriendModel = require('model/facebookFriend');

	var descriptionText1 = L('Receive');
	var descriptionText2 = L('2 candy');
	var descriptionText3 = L('for each friend you invite');
	var textOffset1 = 19;
	var textOffset2 = 75;
	var textOffset3 = 137;	
	var topOffset = 22;
	var isActionTaken = false;
	
	if(_forcedInvite) {
		if(Ti.App.NUM_INVITE_BEFORE_SIGNUP <= 0) {
			descriptionText1 = L('Invite some friends to get started');	
			descriptionText2 = "";
			descriptionText3 = "";	
		} else {
			descriptionText1 = L('Invitex');	
			descriptionText2 = String.format(L('x friends'), (Ti.App.NUM_INVITE_BEFORE_SIGNUP+''));
			descriptionText3 = L('to get started');	
		}
		textOffset1 = 62;
		textOffset2 = 102;
		textOffset3 = 172;
	}
	var emptyView = Titanium.UI.createView({});

	var targetedList = [];
	var numInvites = 0;
	var userCredit = CreditSystem.getUserCredit();
	
	var inviteButtonLabel =  L('Invite'); 
	if(numInvites > 0) inviteButtonLabel =  L('Invite') + ' (' + numInvites + ')'; 
	
	var inviteButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width:84,
		height:30,
		font:{fontSize:14,fontWeight:'bold'},
		title: inviteButtonLabel,
		enabled: true
	});
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png'
	});
				
	var skipButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width:44,
		height:30,
		font:{fontSize:14,fontWeight:'bold'},
		title: L('Skip'),
	});
			
	var self = Titanium.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		title: L('FriendsInvite'),
		navBarHidden: false,
		rightNavButton: inviteButton,
		backgroundColor: '#eeeeee'
	});
	
	if(_forcedInvite) {
		if(Ti.App.NUM_INVITE_BEFORE_SIGNUP === 0) {
			self.leftNavButton = skipButton;
		} else {
			self.leftNavButton = emptyView;
		}
		self.title = L('FriendsInvite');
	} else {
		self.leftNavButton = backButton;
		self.title = L('Get Free Candy');
	}
	
	//description section
	var screenDescriptionView = Ti.UI.createView({
		top: 0,
		left: 0,
		width:'100%',
		height:57,
		backgroundColor: '#eeeeee',
		borderColor: 'transparent', 
		borderWidth: 0,
	});

	var screenDescriptionViewBottomBorder = Ti.UI.createView({
		top: 56, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		zIndex: 1
	});

	var descriptionLabel1 = Ti.UI.createLabel({
		text: descriptionText1,
		left: textOffset1,
		top: topOffset,
		font:{fontSize:14, fontWeight: 'bold'},
		color: '#919191'
	});
	
	var descriptionLabel2 = Ti.UI.createLabel({
		text: descriptionText2,
		left: textOffset2,
		top: topOffset,
		font:{fontSize:14, fontWeight: 'bold'},
		color: '#e01124'
	});
	
	var descriptionLabel3 = Ti.UI.createLabel({
		text: descriptionText3,
		left: textOffset3,
		top: topOffset,
		font:{fontSize:14, fontWeight: 'bold'},
		color: '#919191'
	});		
	
	screenDescriptionView.add(descriptionLabel1);
	screenDescriptionView.add(descriptionLabel2);
	screenDescriptionView.add(descriptionLabel3);
	screenDescriptionView.add(screenDescriptionViewBottomBorder);
	self.add(screenDescriptionView);
	
	//end description section

	var listHeight = 423;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		listHeight = 511;
	}
	
	var inviteFriendTemplate = {
		properties: {
			selectionStyle: Ti.UI.iPhone.ListViewCellSelectionStyle.NONE
		},
		childTemplates: [
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'friendImage', 
				properties: {
					left: 6, 
					width: 35,
					height: 35, 
					touchEnabled: false, 
					borderWidth: 1, 
					borderRadius: 2, 
					borderColor: '#d5d5d5',
				}
			}, 
			{
				type: 'Ti.UI.Label', 
				bindId: 'friendName', 
				properties: {
					top: 10,
					left: 50, 
					color: '#919191',
					font: {fontSize: 15, fontWeight: 'bold'}
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'checkboxImage', 
				properties: {
					top: 7,
					left: 275, 
					width: 29, 
					height: 30,
				}
			}, 
		]
	};
	
	var inviteFriendListView = Ti.UI.createListView({
		top: 57,
		left: 0,
		height: listHeight,
		templates: {'inviteFriendTemplate': inviteFriendTemplate}, 
		defaultItemTemplate: 'inviteFriendTemplate',
	});
	
	var listSection = null;
	
	//create data 
	var inviteFriendData = [];
	
	var createInviteFriendData = function(_friendList) {
		var inviteFriendData = [];
		for(var i = 0; i < _friendList.length; i++) {
			var curUser = _friendList[i];
			inviteFriendData.push({
				friendImage: { image: curUser.picture_url},
				friendName: { text: curUser.name},
				checkboxImage: {image: 'images/invite_friend/unchecked.png'},
				friendFbId: curUser.facebook_id, 
				isInvited: false
			});	
		}
		return inviteFriendData;
	};
	
	var removedInviteCompletedCallbackFlag = false;

	var openOnboardingStep3 = function() {
		Ti.App.fireEvent('openOnboardingStep3', {userId: _userId});
	};

	var inviteFailedCallback = function(e) {
		isActionTaken = false;
	};
	Ti.App.addEventListener('inviteFailed', inviteFailedCallback);
		
	var inviteCompletedCallback = function(e) {
		isActionTaken = false;

		//need to record who already got invited to the local db
		FacebookFriendModel.updateIsInvited(e.inviteeList);
		
		var newInviteFriendItems = [];
		var inviteFriendItems = inviteFriendListView.sections[0].items;
		for(var i = 0; i < inviteFriendItems.length; i++) {
			var isStillIncluded = true;
			var curItem = inviteFriendItems[i]; //friendFbId
			for(var j = 0; j < e.inviteeList.length; j++) {
				if(curItem.friendFbId === e.inviteeList[j]) {
					isIncluded = false; //already invite, not in the list anymore
					break;
				}
			}
			
			if(isStillIncluded) newInviteFriendItems.push(curItem);				
		}
		listSection.items = newInviteFriendItems; //re-display again
		
		if(!_forcedInvite) {
			//the event 'inviteCompletedCallback' listener and actions 
			//such as BackendInvite.saveInvitedPeople and CreditSystem.setUserCredit
			// are in ApplicationWindow.js
			_navGroup.close(self, {animated:true});
		} else {
			var invitedData = {userId:_userId, invitedFbIds:e.inviteeList, trackingCode: e.trackingCode};
	
			BackendInvite.saveInvitedPeople(invitedData, function(e){
				if(e.success) {
					Ti.App.CUSTOMER_TYPE = e.content.customer_type;
					CreditSystem.setUserCredit(e.content.credit); //sync the credit >> change to 90 credits initially
				}
			});
			Ti.App.NSAnalytics.trackEvent("InviteJustSignedUp","inviteCompleted",'inviter: '+_userId,e.inviteeList.length);
		
			openOnboardingStep3();
		}
		Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		Ti.App.removeEventListener('inviteFailed', inviteFailedCallback);
		removedInviteCompletedCallbackFlag = true;
	};
	Ti.App.addEventListener('inviteCompleted', inviteCompletedCallback);
	
	var friendList = FacebookFriend.getFacebookFriends();
	var friendListViewData = createInviteFriendData(friendList);
	
	listSection = Ti.UI.createListSection({items: friendListViewData});
	inviteFriendListView.sections = [listSection];
	self.add(inviteFriendListView);

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true});
	});
	
	skipButton.addEventListener('click', function() {
		Ti.App.NSAnalytics.trackEvent("FacebookInvite","skip",'user: '+_userId,1);
		openOnboardingStep3();
	});
	
	inviteButtonClickCallback = function() {
		//iterate through the table rows to get the selected id
		if(!isActionTaken) {
			isActionTaken = true;
			var invitedList = [];
			var inviteFriendItems = inviteFriendListView.sections[0].items;
			for(var i = 0; i < inviteFriendItems.length; i++) {
				var curItem = inviteFriendItems[i];
				if(curItem.isInvited) {
					//Ti.API.info('fbId: '+curItem.friendFbId + ' is invited');
					invitedList.push(curItem.friendFbId);
				}
			}
			
			if(invitedList.length > 0) {
				if(Ti.App.ACTUAL_FB_INVITE) {
					FacebookSharing.sendRequestOnFacebook(invitedList.join(','));
				} else {
					Ti.App.fireEvent('inviteCompleted', {inviteeList:invitedList, trackingCode:'FROM_SIMULATOR'});
				}
			} else {
				//alert, please select at least one friend to invite
				var chooseAtLeastOneFriendDialog = Titanium.UI.createAlertDialog({
					title: L('Noonswoon'),
					message:L('Please select at least 1 friend'),
					buttonNames: [L('Ok')],
					cancel: 0
				});
				chooseAtLeastOneFriendDialog.show();
				isActionTaken = false;
			}
		}
	};
	inviteButton.addEventListener('click', inviteButtonClickCallback);

	var invitedFriendCallback = function(){
		numInvites++;
		inviteButton.title = L('Invite') +' ('+numInvites+')';
	};
	Ti.App.addEventListener('invitedFriend', invitedFriendCallback);
	
	var uninvitedFriendCallback = function(){
		numInvites--;
		if(numInvites == 0) {
			inviteButton.title = L('Invite');
		} else 
			inviteButton.title = L('Invite') +' ('+numInvites+')';
	};
	Ti.App.addEventListener('uninvitedFriend', uninvitedFriendCallback);

	inviteFriendListView.addEventListener('itemclick', function(e){
	    var item = e.section.getItemAt(e.itemIndex);
	    
	    if(item.isInvited) {
	    	item.checkboxImage.image = 'images/invite_friend/unchecked.png';
	    	item.friendName.color = '#919191';
	    	item.isInvited = false;
	    	Ti.App.fireEvent('uninvitedFriend');
	    } else {
	    	if(numInvites < Ti.App.MAXIMUM_FB_INVITES_PER_DAY) {
		    	item.checkboxImage.image = 'images/invite_friend/checked.png';
		    	item.friendName.color = '#595959';
		    	item.isInvited = true;
		    	Ti.App.fireEvent('invitedFriend'); 	    		
	    	} else {
				var warningInvitesDialog = Titanium.UI.createAlertDialog({
					title: L('Warning'),
					message:L('You can only invite up to 50 Facebook friends per day.'),
					buttonNames: [L('Ok')],
					cancel: 0
				});
				warningInvitesDialog.show();
			}
	    }
	    e.section.updateItemAt(e.itemIndex, item);
	});
		
	self.addEventListener('close', function() {
		Ti.API.info('inviteFriendWindow closing..');
		if(!removedInviteCompletedCallbackFlag) {
			Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		}
		Ti.App.removeEventListener('invitedFriend', invitedFriendCallback);
		Ti.App.removeEventListener('uninvitedFriend', uninvitedFriendCallback);
	});
	
	return self;
};
module.exports = InviteFriendWindow;
