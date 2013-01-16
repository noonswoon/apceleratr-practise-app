TopFriendsView = function(_userId) {
	var FacebookFriendModel = require('model/facebookFriend');
	var BackendInvite = require('backend_libs/backendInvite');
	var BackendCredit = require('backend_libs/backendCredit');
	var FacebookSharing = require('internal_libs/facebookSharing');
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
	
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
	var targetedList = [];
	var targetedCounter = 0;
	
	Ti.API.info('offeredCities***: '+offeredCities);
	
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
		
	var query = "SELECT uid, name, pic_square, current_location FROM user ";
		query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
		query += " and not is_app_user";
		query += " and (relationship_status != 'In a relationship' and relationship_status != 'Engaged'";
		query += " and relationship_status != 'Married') order by first_name";

	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			var friendList = JSON.parse(r.result);
			
			var candidateList = []; 

			//need to exclude people from out-of-town			
			if(offeredCities === 'all') {
				for(var i = 0; i < friendList.length; i++)
					candidateList.push({uid: friendList[i].uid, name: friendList[i].name, pic_square: friendList[i].pic_square});
			} else {
				for(var i = 0; i < friendList.length; i++) {
					if(friendList[i].current_location && offeredCities.indexOf(friendList[i].current_location.city) != -1) {
						candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
											pic_square: friendList[i].pic_square, city: friendList[i].current_location.city});
					}
				}
				FacebookFriendModel.populateFacebookFriend(candidateList);	
			}
			
			BackendInvite.getInvitedList(_userId, function(invitedList) {
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
		}
	});

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