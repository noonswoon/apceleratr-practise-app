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
			}
		}
		Ti.App.fireEvent('completedFacebookFriendQuery', {candidateList: candidateList});
	});
};

/*
 * 
SELECT object_id, object_type, user_id FROM like WHERE post_id in ('202852_10100481970184683', '202852_10100481889945483', '202852_10100481889940493')
 */
exports.queryUserStream = function() {
		
	var query = "SELECT post_id FROM stream where source_id=me() limit 0,150";
	var userStreamIdList = []; 
	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				userStreamIdList.push("'"+dataArray[i].post_id+"'");
			}
		}
		Ti.App.fireEvent('completedUserStreamQuery', {userStreamIdList: userStreamIdList});
	});
};

exports.queryUserLikes = function(_streamIdList) {
	
	var streamIds = _streamIdList.join(',');
	var query = "SELECT object_id, object_type, user_id FROM like where post_id in ("+streamIds+")" ;
	Ti.API.info(query);
	var friendsWhoLikeList = []; 

	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				friendsWhoLikeList.push(dataArray[i].user_id);
			}
		}
		Ti.API.info('userLikes Length: '+ friendsWhoLikeList.length);
		Ti.App.fireEvent('completedUserLikeQuery', {friendsWhoLikeList: friendsWhoLikeList});
	});
};

exports.queryUserComments = function(_streamIdList) {
	
	var streamIds = _streamIdList.join(',');
	var query = "SELECT fromid FROM comment WHERE post_id in ("+streamIds+")" ;
	Ti.API.info(query);
	var friendsWhoCommentList = []; 

	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			Ti.API.info('commentQuery: '+JSON.stringify(r));
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				friendsWhoCommentList.push(dataArray[i].fromid);
			}
		}
		Ti.API.info('userComments Length: '+ friendsWhoCommentList.length);
		Ti.App.fireEvent('completedUserCommentQuery', {friendsWhoCommentList: friendsWhoCommentList});
	});
};

exports.queryUserPhotos = function() {
	var query = "SELECT object_id, created FROM photo WHERE owner = me() ORDER BY created desc limit 0,500" ;
	var userFbPhotoIds = []; 
	Ti.API.info('querying user photos...');
	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			Ti.API.info('photoQuery: '+JSON.stringify(r));
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				userFbPhotoIds.push(dataArray[i].object_id);
			}
		}
		Ti.API.info('userFbPhotoIds Length: '+ userFbPhotoIds.length);
		Ti.App.fireEvent('completedUserPhotoQuery', {userFbPhotoIds: userFbPhotoIds});
	});
//SELECT subject, text from photo_tag where  object_id = 10100444563662653
};

exports.queryUserPhotoTags = function(_objectList) {
	
	var inCondition = "(" + _objectList.join(', ') + ")";  //not outputing????
	Ti.API.info("userPhotoTag inCondition: "+inCondition);
	//var query = "SELECT subject, text from photo_tag where  object_id in (10100444563662653, 10100459791306333)";
	var query = "SELECT subject, text from photo_tag where object_id in " + inCondition ;
	var taggedFriends = []; 

	Titanium.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			if (r.error) Ti.API.info(r.error);
			else Ti.API.info("Call was unsuccessful");
		} else {
			Ti.API.info('taggedFriendsQuery: '+JSON.stringify(r));
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				if(dataArray[i].subject !== "")
					taggedFriends.push(dataArray[i].subject);
			}
		}
		Ti.API.info('taggedFriends Length: '+ taggedFriends.length);
		Ti.App.fireEvent('completedPhotoTagQuery', {taggedFriends: taggedFriends});
	});
//SELECT object_id, created FROM photo WHERE owner = me() ORDER BY created desc limit 0,500 	
//SELECT subject, text from photo_tag where  object_id = 10100444563662653
};