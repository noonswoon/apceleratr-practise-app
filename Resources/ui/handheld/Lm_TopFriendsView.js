TopFriendsView = function(_userId) {
	var FacebookFriendModel = require('model/facebookFriend');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendCredit = require('backend_libs/backendCredit');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var FacebookQuery = require('internal_libs/facebookQuery');
	var TopFriendsTableViewRow = require('ui/handheld/Lm_TopFriendsTableViewRow');
	var CreditSystem = require('internal_libs/creditSystem');
		
	var self = Ti.UI.createView({
		top: 81, 
		height: 400,
		width: 260
	});

	var topFriendsTableView = Ti.UI.createTableView({
		backgroundColor: '#4a4949',
		separatorColor: 'transparent',
		top: 0,
		left: 0,
		scrollable: false
	});
	if(Ti.Platform.osname === 'iphone') {
		topFriendsTableView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}			
	var targetedList = [];
	
	var insertNextCandidate = function(_friendData) {
		var topFriendsRow = new TopFriendsTableViewRow(_friendData);
		if(topFriendsTableView.data[0].rowCount > 0) {
			topFriendsTableView.insertRowAfter(topFriendsTableView.data[0].rowCount -1, topFriendsRow, true);
		} else { 
			topFriendsTableView.appendRow(topFriendsRow);
		}
	};
	
	var createTopFriendTableRowData = function(_friendList){
		var tableData = [];
		for(var i = 0; i < _friendList.length; i++) {
			
			if(i === Ti.App.NUM_TOP_FRIENDS)
				break; //only build for the first X friends on left menu

			var curUser = _friendList[i];

			var topFriendsRow = new TopFriendsTableViewRow(curUser);
			tableData.push(topFriendsRow);
		}
		return tableData;
	};

	Ti.App.addEventListener('facebookFriendClosenessScoreUpdated', function() {
		topFriendsTableView.data = [];
		var targetedList = FacebookFriendModel.getTopFiveFacebookFriends()
		var friendTableRowData = createTopFriendTableRowData(targetedList);
		topFriendsTableView.setData(friendTableRowData);
	});

	if(CacheHelper.shouldFetchData('FacebookFriendQuery_'+Ti.Facebook.uid, 0)) {
		Ti.API.info('have NOT fetched fb data');
		CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.Facebook.uid); //no need to fetch again
		FacebookQuery.queryFacebookFriends();
	}  else {
		Ti.API.info('already fetched fb data...');
		//might not have the data in the scenario where the user deleted the app and re-install again
		var targetedList = FacebookFriendModel.getTopFiveFacebookFriends(); 
		if(targetedList.length === 0) {
			Ti.API.info('refresh again...');
			CacheHelper.recordFetchedData('FacebookFriendQuery_'+Ti.Facebook.uid); //no need to fetch again
			FacebookQuery.queryFacebookFriends();
		} else {
			var friendTableRowData = createTopFriendTableRowData(targetedList);
			topFriendsTableView.setData(friendTableRowData);
		}
	}
	Ti.App.addEventListener('inviteCompleted', function(e){
		Ti.App.Flurry.logEvent('left-menu-invite-success', {numberInvites: e.inviteeList.length});
		//update local database for those people who already got invited
		FacebookFriendModel.updateIsInvited(e.inviteeList);
		
		//iterate to remove the table view row	
		var numRowsAffected = 0;
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < topFriendsTableView.data[0].rowCount; j++) {
				var row = topFriendsTableView.data[0].rows[j];
				if(row.fbId === e.inviteeList[i]) {
					targetedRow = j;
					numRowsAffected++;
					break;
				}
			}
			topFriendsTableView.deleteRow(targetedRow);	
			topupAmount += 2;
		}
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList, trackingCode: e.trackingCode};
		Ti.API.info('invitedData: '+JSON.stringify(invitedData));
		
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
			CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
		});
		
		//add the next row to the table
		var friendCandidates = [];
		if(numRowsAffected >= 1)  {
			if(numRowsAffected > 1) {
				friendCandidates = FacebookFriendModel.getNInvitableFacebookFriend(numRowsAffected);
			} else {
				var nextCandidate = FacebookFriendModel.getFacebookFriendAtIndex(4);
				friendCandidates.push(nextCandidate);				
			}
		} 
				
		if(friendCandidates.length > 0) {
			for(var i = 0; i < friendCandidates.length; i++) {
				var candidate = friendCandidates[i];
				insertNextCandidate(candidate);
			}			
		}
	});
	
	self.add(topFriendsTableView);
	
	var inviteButton = Ti.UI.createButton({
		backgroundImage: 'images/menu-bottom-bar-button.png',
		top:230,
		left: 10,
		width:240,
		height:35,
	});
	
	var inviteButtonText = Ti.UI.createLabel({
		text: L('Invite these 5 friends'),
		color: '#a4a3a3',
		font: {fontSize:14,fontWeight:'bold'},
		center: {x:'50%', y:'50%'}
	});
	inviteButton.add(inviteButtonText);

	inviteButton.addEventListener('click', function() {
		Ti.App.Flurry.logEvent('left-menu-batch-invite');
		var batchInviteList = [];
		if(topFriendsTableView.data === null || topFriendsTableView.data[0] === null) 
			return; //data isn't ready yet

		for(var j = 0; j < topFriendsTableView.data[0].rowCount; j++) {
			var row = topFriendsTableView.data[0].rows[j];
			batchInviteList.push(row.fbId);
		}
		
		if(Ti.App.ACTUAL_FB_INVITE) {
			FacebookSharing.sendRequestOnFacebook(batchInviteList.join(','));	
		} else {
			Ti.App.fireEvent('inviteCompleted', {inviteeList:batchInviteList,trackingCode:'FROM_SIMULATOR'});
		}
	});	
	
	/*
	//345, 60, 8, 1043, 2400, 5306, 6490, 203, 420, 300, 0, 10345
	var testData = [345, 60, 8, 1043, 2400, 5306, 6490, 203, 420, 300, 0, 10345];
	var counter = 0;
	inviteButton.addEventListener('click', function() {
		Ti.App.fireEvent('creditChange', {currentCredit: testData[counter]});
		counter++;
	});
	*/
	
	self.add(inviteButton);
	
	return self;
}
module.exports = TopFriendsView;