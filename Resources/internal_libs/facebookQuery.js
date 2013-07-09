exports.queryFacebookFriends = function() {
	var offeredCities = 'all';
	if(Ti.App.OFFERED_CITIES !== 'all') 
		offeredCities = Ti.App.OFFERED_CITIES.join(',');
		
	var query = "SELECT uid, name, pic_square, current_location, sex, relationship_status FROM user ";
		query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Ti.App.Facebook.uid + ")";
		query += " and not is_app_user";
		query += " and (relationship_status != 'In a relationship' and relationship_status != 'Engaged'";
		query += " and relationship_status != 'Married') order by first_name";

	var candidateList = []; 

	Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			//Ti.App.Facebook.logout();
			Ti.App.LogSystem.logEntryError('Fb Call failed queryFacebookFriends: '+ JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
		} else {
			var friendList = JSON.parse(r.result);
			//Ti.API.info('offeredCities: '+offeredCities);
			//need to exclude people from out-of-town			
			if(offeredCities === 'all') {
				for(var i = 0; i < friendList.length; i++) {
					var sex = "";
					if(friendList[i].sex !== null)
						sex = friendList[i].sex;
					
					var relationship_status = "";
					if(friendList[i].relationship_status !== null)
						relationship_status = friendList[i].relationship_status;
						
					var cityStr = 'none';
					if(friendList[i].current_location && friendList[i].current_location.city)
						cityStr = friendList[i].current_location.city;
					
					candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
						pic_square: friendList[i].pic_square, city: cityStr, sex:sex, relationship_status: relationship_status});
				}
			} else {
				for(var i = 0; i < friendList.length; i++) {
					var sex = "";
					if(friendList[i].sex !== null)
						sex = friendList[i].sex;
					
					var relationship_status = "";
					if(friendList[i].relationship_status !== null)
						relationship_status = friendList[i].relationship_status;

					if(friendList[i].current_location && offeredCities.indexOf(friendList[i].current_location.city) != -1) {
						candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
							pic_square: friendList[i].pic_square, city: friendList[i].current_location.city, sex:sex, relationship_status: relationship_status});
					}
				}
			}
		}
		Ti.App.fireEvent('completedFacebookFriendQuery', {candidateList: candidateList});
	});
};

/*
exports.queryUserStream = function() {
		
	var query = "SELECT post_id FROM stream where source_id=me() limit 0,150";
	var userStreamIdList = []; 
	Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			//Ti.App.Facebook.logout();
			Ti.App.LogSystem.logEntryError('Fb Call failed queryUserStream: '+ JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
		} else {
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				userStreamIdList.push("'"+dataArray[i].post_id+"'");
			}
		}
		Ti.App.fireEvent('completedUserStreamQuery', {userStreamIdList: userStreamIdList});
	});
};
*/
/*
//currently not using coz we are not requesting read_stream permission
exports.queryUserLikes = function(_streamIdList) {
	
	var streamIds = _streamIdList.join(',');
	var query = "SELECT object_id, object_type, user_id FROM like where post_id in ("+streamIds+")" ;
	//Ti.API.info(query);
	var friendsWhoLikeList = []; 

	Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			//Ti.App.Facebook.logout();
			Ti.App.LogSystem.logEntryError('Fb Call failed queryUserLikes: '+ JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
		} else {
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				friendsWhoLikeList.push(dataArray[i].user_id);
			}
		}
		Ti.App.fireEvent('completedUserLikeQuery', {friendsWhoLikeList: friendsWhoLikeList});
	});
};
*/
/*
//currently not using coz we are not requesting read_stream permission
exports.queryUserComments = function(_streamIdList) {
	
	var streamIds = _streamIdList.join(',');
	var query = "SELECT fromid FROM comment WHERE post_id in ("+streamIds+")" ;
	//Ti.API.info(query);
	var friendsWhoCommentList = []; 

	Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			//Ti.App.Facebook.logout();
			Ti.App.LogSystem.logEntryError('Fb Call failed queryUserComments: ' + JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
		} else {
			//Ti.API.info('commentQuery: '+JSON.stringify(r));
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				friendsWhoCommentList.push(dataArray[i].fromid);
			}
		}
		//Ti.API.info('userComments Length: '+ friendsWhoCommentList.length);
		Ti.App.fireEvent('completedUserCommentQuery', {friendsWhoCommentList: friendsWhoCommentList});
	});
};
*/
/*
exports.queryUserPhotos = function() {
	var query = "SELECT pid, created FROM photo WHERE owner = me() ORDER BY created desc limit 0,500";
	var userFbPhotoIds = []; 
	Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
		if (!r.success) {
			//Ti.App.Facebook.logout();
			Ti.App.LogSystem.logEntryError('Fb Call failed queryUserPhotos: ' + JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
		} else {
			//Ti.API.info('photoQuery: '+JSON.stringify(r));
			var dataArray = JSON.parse(r.result);
			
			for(var i = 0; i < dataArray.length; i++) {
				//Ti.API.info('photo object id: '+dataArray[i].pid);
				userFbPhotoIds.push(dataArray[i].pid);
			}
		}
		//Ti.API.info('userFbPhotoIds Length: '+ userFbPhotoIds.length);
		Ti.App.fireEvent('completedUserPhotoQuery', {userFbPhotoIds: userFbPhotoIds});
	});
};
*/
/*
exports.queryUserPhotoTags = function(_photoIdList) {
	
	if(_photoIdList.length <= 0) {
		Ti.App.fireEvent('completedPhotoTagQuery', {taggedFriends: []});
	} else {
		var inCondition = "(" + _photoIdList.join(', ') + ")";  //not outputing????
		//Ti.API.info("userPhotoTag inCondition: "+inCondition);
		//var query = "SELECT subject, text from photo_tag where  object_id in (10100444563662653, 10100459791306333)";
		var query = "SELECT subject, text from photo_tag where pid in " + inCondition ;
		var taggedFriends = []; 
	
		Ti.App.Facebook.request('fql.query', {query: query},  function(r) {
			if (!r.success) {
				//Ti.App.Facebook.logout();
				Ti.App.LogSystem.logEntryError('Fb Call failed queryUserPhotoTags: ' + JSON.stringify(r) + ' (MacAddr: '+ Ti.Platform.id+')');
			} else {
				//Ti.API.info('taggedFriendsQuery: '+JSON.stringify(r));
				var dataArray = JSON.parse(r.result);
				
				for(var i = 0; i < dataArray.length; i++) {
					if(dataArray[i].subject !== "")
						taggedFriends.push(dataArray[i].subject);
				}
			}
			//Ti.API.info('taggedFriends Length: '+ taggedFriends.length);
			Ti.App.fireEvent('completedPhotoTagQuery', {taggedFriends: taggedFriends});
		});
	}
};
*/