InviteFriendWindow = function(_navGroup, _userId, _forcedInvite) {
	if(_forcedInvite) {
		Ti.App.Flurry.logEvent('after-signup-onboard-2-invite');
	}	
	Ti.App.Flurry.logTimedEvent('invite-screen');
		
	var InviteFriendTableViewRow = require('ui/handheld/Mn_InviteFriendTableViewRow');
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
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		tableHeight = 511; // 568 - 57 = 511
	}
	var facebookFriendTableView = Ti.UI.createTableView({
		searchHidden:false,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
		top: 57,
		width: 320,
		height: tableHeight
	});

	facebookFriendSearch.addEventListener('return', function(e) {
		facebookFriendSearch.blur();
	});
	
	facebookFriendSearch.addEventListener('cancel', function(e) {
		facebookFriendSearch.blur();
	});		
	
	var createFriendTable = function(_friendList) {
		var tableData = [];
		for(var i = 0; i<_friendList.length;i++) {
			var curUser = _friendList[i];
			var userRow = new InviteFriendTableViewRow(curUser,i);
			tableData.push(userRow);
		}
		return tableData;
	};
	
	var removedInviteCompletedBallbackFlag = false;

	var inviteCompletedCallback = function(e) {
		FacebookFriendModel.updateIsInvited(e.inviteeList);
		//iterate to remove the table view row	
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < facebookFriendTableView.data[0].rowCount; j++) {
				var row = facebookFriendTableView.data[0].rows[j];
				if(row.fbId === e.inviteeList[i]) {
					targetedRow = j;
					break;
				}
			}
			facebookFriendTableView.deleteRow(targetedRow);	
			topupAmount += 2;
		}
		
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList, trackingCode: e.trackingCode};
		
		//need to record who already got invited to the local db
		
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		
		if(!_forcedInvite) { //only save the transaction if it isn't a forced invite
			Ti.App.Flurry.logEvent('invite-number-invites', { numberInvites: e.inviteeList.length});
			BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
				CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
			});
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
	var friendTableRowData = createFriendTable(friendList);
	
	//add empty row here
	var emptyRow = new EmptyTableViewRow()
	friendTableRowData.push(emptyRow);
	
	facebookFriendTableView.setData(friendTableRowData);

	self.add(facebookFriendTableView);

	inviteButtonClickCallback = function() {
		//iterate through the table rows to get the selected id
		var targetedRow = 0;
		var invitedList = [];
		for(var i = 0; i < facebookFriendTableView.data[0].rowCount; i++) {
			var row = facebookFriendTableView.data[0].rows[i];
			if(row.isInvited()) {
				invitedList.push(row.fbId);
			}
		}
		
		if(Ti.App.ACTUAL_FB_INVITE) {
			FacebookSharing.sendRequestOnFacebook(invitedList.join(','));
		} else {
			Ti.App.fireEvent('inviteCompleted', {inviteeList:invitedList, trackingCode:'FROM_SIMULATOR'});
		}
	};
	inviteButton.addEventListener('click', inviteButtonClickCallback);

	backButton.addEventListener('click', function() {
		Ti.App.Flurry.endTimedEvent('invite-screen');
		_navGroup.close(self, {animated:true}); //go to the main screen
	});

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
