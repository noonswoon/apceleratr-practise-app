TopFriendsView = function(_userId) {
	var BackendInvite = require('backend_libs/backendInvite');
	
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
	
	Ti.API.info('offeredCities***: '+offeredCities);
	
	var createTopFriendTableRowData = function(_friendList){
		var tableData = [];
		Ti.API.info('_friendList: '+_friendList.length);
		for(var i = 0; i < _friendList.length; i++) {
			
			if(i === Ti.App.NUM_TOP_FRIENDS)
				break; //only build for the first X friends on left menu

			var curUser = _friendList[i];

			var row = Ti.UI.createTableViewRow({
				height: 50,
				backgroundColor: '#32394a',
				fb_id: curUser.uid
			});
				
			var friendImage = Ti.UI.createImageView({
				image: curUser.pic_square,
				width: 40, 
				height: 40, 
				top: 5,
				left: 5
			}); 
			
			var friendName = Ti.UI.createLabel({
				text: curUser.name,
				left: 55,
				top: 25,
				color: '#cdd4df',
				font:{fontWeight:'bold',fontSize:16},
			}); 
			
			var inviteIcon = Ti.UI.createImageView({
				image: 'images/leftmenu/invite_friend_button.png',
				right: 10,
				top: 5,
				width: 50,
				height: 40
			});
			
			row.add(friendImage);
			row.add(friendName);
			row.add(inviteIcon);			
			
			tableData.push(row);
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
			Ti.API.info('friendList from Fb: '+friendList.length+', ID: '+offeredCities);
			
			if(offeredCities === 'all') {
				for(var i = 0; i < friendList.length; i++)
					candidateList.push({uid: friendList[i].uid, name: friendList[i].name, pic_square: friendList[i].pic_square});
			} else {
				for(var i = 0; i < friendList.length; i++) {
					if(friendList[i].current_location && offeredCities.indexOf(friendList[i].current_location.city) != -1) {
						candidateList.push({uid: friendList[i].uid, name: friendList[i].name, pic_square: friendList[i].pic_square});
					}
				}
			}
			
			Ti.API.info('friends in targeted cities: '+candidateList.length);
			
			BackendInvite.getInvitedList(_userId, function(invitedList) {
				var targetedList = [];
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

	self.add(topFriendsTableView);
	
	return self;
}
module.exports = TopFriendsView;