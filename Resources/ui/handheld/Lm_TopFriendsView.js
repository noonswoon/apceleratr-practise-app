TopFriendsView = function(_userId) {
	var FacebookFriendModel = require('model/facebookFriend');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendCredit = require('backend_libs/backendCredit');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var FacebookFriendQuery = require('internal_libs/facebookFriendQuery');
	var TopFriendsTableViewRow = require('ui/handheld/Lm_TopFriendsTableViewRow');
		
	var self = Ti.UI.createView({
		top: 74, 
		height: 250,
		width: 260
	});

	var topFriendsTableView = Ti.UI.createTableView({
		backgroundColor: '#32394a',
		separatorColor: '#242a37',
		top: 0,
		left: 0
	});
	
	var targetedList = [];
	var targetedCounter = 0;
	
	var insertNextCandidate = function() {  //refactoring out (1)

		var topFriendsRow = new TopFriendsTableViewRow(targetedList[targetedCounter]);
		topFriendsTableView.insertRowAfter(topFriendsTableView.data[0].rowCount -1, topFriendsRow, true);
		targetedCounter++;
	};
	
	var createTopFriendTableRowData = function(_friendList){
		var tableData = [];
		Ti.API.info('_friendList: '+_friendList.length);
		for(var i = 0; i < _friendList.length; i++) {
			
			if(i === Ti.App.NUM_TOP_FRIENDS)
				break; //only build for the first X friends on left menu

			var curUser = _friendList[i];

			var topFriendsRow = new TopFriendsTableViewRow(curUser);
			tableData.push(topFriendsRow);
			targetedCounter++;
		}
		return tableData;
	};
	
	var shuffleArray = function(o){ //v1.0
	    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	};	

	Ti.App.addEventListener('completedFacebookFriendQuery', function(e) {
		Ti.API.info('heard completedFacebookFriendQuery: '+ JSON.stringify(e.candidateList));
		var candidateList = e.candidateList;
		
		FacebookFriendModel.populateFacebookFriend(candidateList);
		BackendInvite.getInvitedList(_userId, function(invitedList) {
			//update the local db for invitedList
			
			targetedList = [];
			for(var i = 0; i < candidateList.length; i++) {
				var isInvited = false;
				for(var j = 0; j < invitedList.length; j++) {
					if(String(candidateList[i].uid) === invitedList[j])
						isInvited = true;
				}
				if(!isInvited) {
					targetedList.push(candidateList[i]); //has not invited..adding
				}
			}
	
			//shuffle targetedList for some excitement
			targetedList = shuffleArray(targetedList); 
			var friendTableRowData = createTopFriendTableRowData(targetedList);
			topFriendsTableView.setData(friendTableRowData);
		});
	});
	FacebookFriendQuery.queryFacebookFriends();
	
	
	Ti.App.addEventListener('inviteCompleted', function(e){
		//iterate to remove the table view row	
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < topFriendsTableView.data[0].rowCount; j++) {
				var row = topFriendsTableView.data[0].rows[j];
				if(row.uid === Number(e.inviteeList[i])) {
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
		insertNextCandidate();
	});
	
	self.add(topFriendsTableView);
	
	return self;
}
module.exports = TopFriendsView;