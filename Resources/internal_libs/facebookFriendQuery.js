exports.queryFacebookFriends = function() {
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
		
	var query = "SELECT uid, name, pic_square, current_location FROM user ";
		query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
		query += " and not is_app_user";
		query += " and (relationship_status != 'In a relationship' and relationship_status != 'Engaged'";
		query += " and relationship_status != 'Married') order by first_name";

	var candidateList = []; 

	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			var friendList = JSON.parse(r.result);
			
			
			//need to exclude people from out-of-town			
			if(offeredCities === 'all') {
				for(var i = 0; i < friendList.length; i++) {
					var cityStr = 'none';
					if(friendList[i].current_location && friendList[i].current_location.city)
						cityStr = friendList[i].current_location.city;
					candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
											pic_square: friendList[i].pic_square, city: cityStr});
				}
			} else {
				for(var i = 0; i < friendList.length; i++) {
					if(friendList[i].current_location && offeredCities.indexOf(friendList[i].current_location.city) != -1) {
						candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
											pic_square: friendList[i].pic_square, city: friendList[i].current_location.city});
					}
				}
				//FacebookFriendModel.populateFacebookFriend(candidateList);	
			}
		}
		Ti.App.fireEvent('completedFacebookFriendQuery', {candidateList: candidateList});
	});
};

