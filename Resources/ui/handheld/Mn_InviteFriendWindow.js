InviteFriendWindow = function(_navGroup, _userId, _forcedInvite) {
	if(_forcedInvite) {
		Ti.App.Flurry.logEvent('after-signup-onboard-2-invite');
	}	
	Ti.App.Flurry.logTimedEvent('invite-screen');

	var EmptyTableViewRow = require('ui/handheld/Mn_EmptyTableViewRow');
	
	var FacebookSharing = require('internal_libs/facebookSharing');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendCredit = require('backend_libs/backendCredit');
	var BackendInvite = require('backend_libs/backendInvite');
	var FacebookFriend = require('model/facebookFriend');

	var FacebookFriendModel = require('model/facebookFriend');

	var descriptionText1 = L('Receive');
	var descriptionText2 = L('2 credits');
	var descriptionText3 = L('for each friend you invite');
	var textOffset1 = 19;
	var textOffset2 = 75;
	var textOffset3 = 137;	
	var topOffset = 22;
	var inviteBtnBgImage = 'images/top-bar-button.png';
	var inviteBtnEnable = true;
	var inviteBtnFontColor = '#f6f7fa';
	if(_forcedInvite) {
		descriptionText1 = L('Invitex');	
		descriptionText2 = String.format(L('x friends'), (Ti.App.NUM_INVITE_ALL+''))
		descriptionText3 = L('to get started');	
		textOffset1 = 62;
		textOffset2 = 102;
		textOffset3 = 172;
		inviteBtnBgImage = 'images/top-bar-button-disabled.png';
		inviteBtnEnable = false;
		inviteBtnFontColor = '#c97278';
	}
	var emptyView = Titanium.UI.createView({});

	var targetedList = [];
	var numInvites = 0;
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
	var userCredit = CreditSystem.getUserCredit();
	var inviteButton = Ti.UI.createButton({
		backgroundImage: inviteBtnBgImage,
		color: inviteBtnFontColor,
		width:84,
		height:30,
		font:{fontSize:14,fontWeight:'bold'},
		title: L('Invite') + ' (' + numInvites + ')',
		enabled: inviteBtnEnable
	});
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png'
	});
		
	var self = Titanium.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		title: L('Friends'),
		navBarHidden: false,
		rightNavButton: inviteButton,
		backgroundColor: '#eeeeee'
	});
	if(_forcedInvite) {
		self.leftNavButton = emptyView;
		self.title = L('FriendsInvite');
	} else {
		self.leftNavButton = backButton;
		self.title = L('FriendsInvite');
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
		borderColor: '#919191',
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
	
	var facebookFriendSearch = Titanium.UI.createSearchBar({
		barColor:'#d3dbdf',
		showCancel:false,
		hintText: L('Search'),
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});

	var tableHeight = 423; //480 - 57
	var listHeight = 423;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		tableHeight = 511; // 568 - 57 = 511
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
		top: 0,
		left: 0,
		height: listHeight,
		templates: {'inviteFriendTemplate': inviteFriendTemplate}, 
		defaultItemTemplate: 'inviteFriendTemplate',
	});
	
	var listSection = null;
	
	//create data 
	var inviteFriendData = [];

	var facebookFriendTableView = Ti.UI.createTableView({
		searchHidden:false,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
		top: 57,
		width: 320,
		height: tableHeight
	});
	
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
	
	var removedInviteCompletedBallbackFlag = false;

	var inviteCompletedCallback = function(e) {
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
		
		if(!_forcedInvite) { //only save the transaction if it isn't a forced invite
			_navGroup.close(self, {animated:true}); //go to the main screen
		} else {
			Ti.App.Flurry.logEvent('after-signup-onboard-2-number-invites', { numberInvites: e.inviteeList.length});
			var OnBoardingStep3Module = require('ui/handheld/Mn_OnBoardingStep3Window');
			var onBoardingStep3Window = new OnBoardingStep3Module(_navGroup, _userId);
			//_navGroup.open(onBoardingStep3Window);
			onBoardingStep3Window.open({ modal:true, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL, 
													modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN, navBarHidden:false});	
			//self.close();
		}
		Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		removedInviteCompletedBallbackFlag = true;
		Ti.App.Flurry.endTimedEvent('invite-screen');
	};
	Ti.App.addEventListener('inviteCompleted', inviteCompletedCallback);
	
	var friendList = FacebookFriend.getFacebookFriends();
	var friendListViewData = createInviteFriendData(friendList);
	Ti.API.info('num friends to show: '+ friendListViewData.length);
	
	listSection = Ti.UI.createListSection({items: friendListViewData});
	inviteFriendListView.sections = [listSection];
	self.add(inviteFriendListView);

	backButton.addEventListener('click', function() {
		Ti.App.Flurry.endTimedEvent('invite-screen');
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	inviteButtonClickCallback = function() {
		//iterate through the table rows to get the selected id
		var invitedList = [];
		var inviteFriendItems = inviteFriendListView.sections[0].items;
		for(var i = 0; i < inviteFriendItems.length; i++) {
			var curItem = inviteFriendItems[i];
			if(curItem.isInvited) {
				//Ti.API.info('fbId: '+curItem.friendFbId + ' is invited');
				invitedList.push(curItem.friendFbId);
			}
		}
		
		if(Ti.App.ACTUAL_FB_INVITE) {
			FacebookSharing.sendRequestOnFacebook(invitedList.join(','));
		} else {
			Ti.App.fireEvent('inviteCompleted', {inviteeList:invitedList, trackingCode:'FROM_SIMULATOR'});
		}
	};
	inviteButton.addEventListener('click', inviteButtonClickCallback);

	var invitedFriendCallback = function(){
		numInvites++;
		inviteButton.title = L('Invite') +' ('+numInvites+')';
		if(_forcedInvite && !inviteBtnEnable && numInvites >= Ti.App.NUM_INVITE_ALL) {
			//BAD DESIGN --  just to get the nav button text color to change..cannot change the text
			//color once already put in the right nav menu bar, so need to re-create a new button and replace it
			inviteBtnEnable = true;
			inviteButton.removeEventListener('click', inviteButtonClickCallback); //remove the old listener before creating a new component
			inviteButton = Ti.UI.createButton({
				backgroundImage: 'images/top-bar-button.png',
				color: '#f6f7fa',
				width:84,
				height:30,
				font:{fontSize:14,fontWeight:'bold'},
				title: L('Invite') + ' ('+numInvites+')',
				enabled: inviteBtnEnable
			});			
			inviteButton.addEventListener('click', inviteButtonClickCallback);
			self.rightNavButton = inviteButton;
		}
	};
	Ti.App.addEventListener('invitedFriend', invitedFriendCallback);
	
	var uninvitedFriendCallback = function(){
		numInvites--;
		inviteButton.title = L('Invite') +' ('+numInvites+')';
		if(_forcedInvite && inviteBtnEnable && numInvites < Ti.App.NUM_INVITE_ALL) {
			//BAD DESIGN --  just to get the nav button text color to change..cannot change the text
			//color once already put in the right nav menu bar, so need to re-create a new button and replace it
			inviteBtnEnable = false;
			inviteButton.removeEventListener('click', inviteButtonClickCallback); //remove the old listener before creating a new component
			inviteButton = Ti.UI.createButton({
				backgroundImage: 'images/top-bar-button-disabled.png',
				color: '#c97278',
				width:84,
				height:30,
				font:{fontSize:14,fontWeight:'bold'},
				title: L('Invite')+ ' (' + numInvites + ')',
				enabled: inviteBtnEnable
			});			
			inviteButton.addEventListener('click', inviteButtonClickCallback);
			self.rightNavButton = inviteButton;
		}
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
	    	item.checkboxImage.image = 'images/invite_friend/checked.png';
	    	item.friendName.color = '#595959';
	    	item.isInvited = true;
	    	Ti.App.fireEvent('invitedFriend'); 
	    }
	    e.section.updateItemAt(e.itemIndex, item);
	});
		
	self.addEventListener('close', function() {
		if(!removedInviteCompletedBallbackFlag) {
			Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		}
		Ti.App.removeEventListener('invitedFriend', invitedFriendCallback);
		Ti.App.removeEventListener('uninvitedFriend', uninvitedFriendCallback);
	});
	
	return self;
}
module.exports = InviteFriendWindow;
