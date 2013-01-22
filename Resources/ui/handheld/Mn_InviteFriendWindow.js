InviteFriendWindow = function(_navGroup, _userId, _forcedInvite) {
		
	var InviteFriendTableViewRow = require('ui/handheld/Mn_InviteFriendTableViewRow');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendCredit = require('backend_libs/backendCredit');
	var BackendInvite = require('backend_libs/backendInvite');
	var FacebookFriend = require('model/facebookFriend');

	var descriptionText1 = 'Receive';
	var descriptionText2 = '2 credits';
	var descriptionText3 = 'for each friend you invite';
	var textOffset1 = 19;
	var textOffset2 = 75;
	var textOffset3 = 137;	
	var topOffset = 22;
	var inviteBtnBgImage = 'images/top-bar-button.png';
	if(_forcedInvite) {
		descriptionText1 = 'Invite';
		descriptionText2 = '10 friends';
		descriptionText3 = 'to get started';	
		textOffset1 = 62;
		textOffset2 = 102;
		textOffset3 = 172;
		inviteBtnBgImage = 'images/top-bar-button-disabled.png';
	}
	var emptyView = Titanium.UI.createView({});

	var targetedList = [];
	var numInvites = 0;
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
	var userCredit = CreditSystem.getUserCredit();
	var inviteButton = Ti.UI.createButton({
			backgroundImage: inviteBtnBgImage,
			color: '#f6f7fa',
			width:84,
			height:30,
			font:{fontSize:12,fontWeight:'bold'},
			title:'Invite ('+numInvites+')'
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
		leftNavButton: backButton,
		rightNavButton: inviteButton
	});
	if(_forcedInvite) {
		self.leftNavButton = emptyView;
		self.title = L('Friends');
	}
	//description section
	var screenDescriptionView = Ti.UI.createView({
		top: 0,
		left: 0,
		width:'100%',
		height:57,
		backgroundColor: '#efefef'
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
		hintText:'Search',
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});

	var facebookFriendTableView = Ti.UI.createTableView({
		searchHidden:false,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
		top: 57,
		width: 320,
		height: 423
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
	
	Ti.App.addEventListener('inviteCompleted', function(e){
		
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
		
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList};
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		
		if(!_forcedInvite) { //only save the transaction if it isn't a forced invite
			BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
				CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
			});
			_navGroup.close(self, {animated:true}); //go to the main screen
		} else {
			//go to the main screen
		}
	});
	
	var friendList = FacebookFriend.getFacebookFriends();
	var friendTableRowData = createFriendTable(friendList);
	facebookFriendTableView.setData(friendTableRowData);

	self.add(facebookFriendTableView);

	inviteButton.addEventListener('click', function() {
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
			Ti.App.fireEvent('inviteCompleted', {inviteeList:invitedList});
		}
	});

	inviteButton.addEventListener('touchstart', function() {
		inviteButton.backgroundImage = 'images/top-bar-button-active.png';		//doesn't work
	});
	
	inviteButton.addEventListener('touchend', function() {
		inviteButton.backgroundImage = 'images/top-bar-button.png';
	});
	
	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});

	var invitedFriendCallback = function(){
		numInvites++;
		inviteButton.title = 'Invite ('+numInvites+')';
	};
	Ti.App.addEventListener('invitedFriend', invitedFriendCallback);
	
	var uninvitedFriendCallback = function(){
		numInvites--;
		inviteButton.title = 'Invite ('+numInvites+')';
	};
	Ti.App.addEventListener('uninvitedFriend', uninvitedFriendCallback);
	return self;
}
module.exports = InviteFriendWindow;
