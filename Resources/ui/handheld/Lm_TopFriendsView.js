TopFriendsView = function(_userId) {
	var FacebookFriendModel = require('model/facebookFriend');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendCredit = require('backend_libs/backendCredit');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var FacebookQuery = require('internal_libs/facebookQuery');
	var TopFriendsTableViewRow = require('ui/handheld/Lm_TopFriendsTableViewRow');
	var CreditSystem = require('internal_libs/creditSystem');
		
	var self = Ti.UI.createView({
		top: 74, 
		height: 300,
		width: 260
	});

	var topFriendsTableView = Ti.UI.createTableView({
		backgroundColor: '#32394a',
		separatorColor: 'transparent',
		top: 0,
		left: 0
	});
	
	var targetedList = [];
	var insertNextCandidate = function() {
		var nextFriendData = FacebookFriendModel.getFacebookFriendAtIndex(4); //not 5 because already account for the just-invited friend
		if(nextFriendData === null)
			return; 
 
		var topFriendsRow = new TopFriendsTableViewRow(nextFriendData);
		topFriendsTableView.insertRowAfter(topFriendsTableView.data[0].rowCount -1, topFriendsRow, true);
	};
	
	var insertNextCandidateBatch = function() {
		var nextFriendBatchData = FacebookFriendModel.getFacebookFriendNextBatch();
		if(nextFriendBatchData.length === 0)
			return; 

 		var nextBatchData = [];
 		for(var i = 0; i < nextFriendBatchData.length; i++) {
			var topFriendsRow = new TopFriendsTableViewRow(nextFriendBatchData[i]);
			nextBatchData.push(topFriendsRow);
 		}
 		topFriendsTableView.setData(nextBatchData);
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
	Ti.App.addEventListener('updateTopFriendsTable', function() {
		topFriendsTableView.data = [];
		var targetedList = FacebookFriendModel.getTopFiveFacebookFriends()
		var friendTableRowData = createTopFriendTableRowData(targetedList);
		topFriendsTableView.setData(friendTableRowData);
	});
	
	//facebook friends fetching from server
	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		var taggedFriends = e.taggedFriends;
		FacebookFriendModel.updateClosenessScoreBatch(taggedFriends);
	});
	
	Ti.App.addEventListener('completedUserPhotoQuery', function(e) {
		var userFbPhotoIds = e.userFbPhotoIds;
		FacebookQuery.queryUserPhotoTags(userFbPhotoIds);
	});
	
	Ti.App.addEventListener('completedUserLikeQuery', function(e) {
		var friendsWhoLikeList = e.friendsWhoLikeList;
		FacebookFriendModel.updateClosenessScoreBatch(friendsWhoLikeList);
		Ti.App.fireEvent('updateTopFriendsTable');
	});
	
	Ti.App.addEventListener('completedUserCommentQuery', function(e) {
		var friendsWhoCommentList = e.friendsWhoCommentList;
		FacebookFriendModel.updateClosenessScoreBatch(friendsWhoCommentList);
		Ti.App.fireEvent('updateTopFriendsTable');
	});
	
	Ti.App.addEventListener('completedPhotoTagQuery', function(e) {
		var taggedFriends = e.taggedFriends;
		FacebookFriendModel.updateClosenessScoreBatch(taggedFriends);
		Ti.App.fireEvent('updateTopFriendsTable');
	});
	
	Ti.App.addEventListener('completedUserStreamQuery', function(e) {
		var userStreamIdList = e.userStreamIdList;
		
		FacebookQuery.queryUserLikes(userStreamIdList);
		FacebookQuery.queryUserComments(userStreamIdList);
		FacebookQuery.queryUserPhotos();
		//query likes, comments, photo albums
	});
	
	Ti.App.addEventListener('completedFacebookFriendQuery', function(e) {
		var candidateList = e.candidateList;
		
		FacebookFriendModel.populateFacebookFriend(candidateList);
		BackendInvite.getInvitedList(_userId, function(invitedList) {
			//update the local db for invitedList
			FacebookFriendModel.updateIsInvited(invitedList);
			var targetedList = FacebookFriendModel.getTopFiveFacebookFriends()
			var friendTableRowData = createTopFriendTableRowData(targetedList);
			topFriendsTableView.setData(friendTableRowData);
		});
		
		//query some read stream and get the comments/like
		FacebookQuery.queryUserStream();
	});
	FacebookQuery.queryFacebookFriends();
	
	
	Ti.App.addEventListener('inviteCompleted', function(e){
		//update local database for those people who already got invited
		FacebookFriendModel.updateIsInvited(e.inviteeList); //can either be just 1 or 5
		
		//iterate to remove the table view row	
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < topFriendsTableView.data[0].rowCount; j++) {
				var row = topFriendsTableView.data[0].rows[j];
				if(row.fbId === e.inviteeList[i]) {
					targetedRow = j;
					break;
				}
			}
			topFriendsTableView.deleteRow(targetedRow);	
			topupAmount += 2;
		}
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList};
		Ti.API.info('invitedData: '+JSON.stringify(invitedData));
		
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
			CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
		});
		
		//add the next row to the table
		if(e.inviteeList.length === 1) {
			insertNextCandidate();
		} else {
			insertNextCandidateBatch();
		}
	});
	
	self.add(topFriendsTableView);
	
	var inviteButton = Ti.UI.createButton({
		backgroundImage: 'none',
		backgroundColor: 'transparent',
		borderColor: '#242a37', 
		borderRadius: 5,
		borderWidth: 1,
		top:260,
		left: 10,
		width:240,
		height:35,
		color: '#9299a6',
		font:{fontSize:14,fontWeight:'bold'},
		title:'Invite these 5 friends'
	});
	inviteButton.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#394155', offset: 0.0}, { color: '#292f3d', offset: 1.0 }]
	};
	
	inviteButton.addEventListener('click', function() {
		var batchInviteList = [];
		for(var j = 0; j < topFriendsTableView.data[0].rowCount; j++) {
			var row = topFriendsTableView.data[0].rows[j];
			batchInviteList.push(row.fbId);
		}
		
		FacebookSharing.sendRequestOnFacebook(batchInviteList.join(','));	
		//Ti.App.fireEvent('inviteCompleted', {inviteeList:batchInviteList});
	});	
	
	
	self.add(inviteButton);
	
	return self;
}
module.exports = TopFriendsView;