/** debug db script **
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var dummy = []
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 AND ClosenessScore > 0 ORDER BY ClosenessScore DESC');
	while(result.isValidRow()) {
		dummy.push({facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
							picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
							is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
						});
		result.next();
	}
	result.close();
	db.close();
	Ti.API.info('after update: '+JSON.stringify(dummy));
**/
var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS FacebookFriend(Id INTEGER PRIMARY KEY, FacebookId TEXT, Name TEXT, Sex TEXT, RelationshipStatus TEXT, PictureUrl TEXT, City TEXT, IsInvited INTEGER, ClosenessScore INTEGER);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.getNameByFacebookId = function(_fbId){
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT Name FROM FacebookFriend WHERE FacebookId = '+ _fbId);
	var name = "";
	if(result.isValidRow()) {
		name = result.fieldByName('Name');
	}
	result.close();
	db.close();
	return name;
};

exports.populateFacebookFriend = function(_friendsCollection) {
	Ti.API.info('populating facebook friend...');
	if(_friendsCollection.length === 0) {
		Ti.API.info('no friends to populate..done');
		return;
	}

	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM FacebookFriend');

	for(var i = 0; i < _friendsCollection.length; i++) {
		
		var curFriend = _friendsCollection[i];
		var curFriendSex = curFriend.sex; 
		var curFriendRelationshipStatus = curFriend.relationship_status;
		
		var closenessScore = 0;
		if(curFriendSex === 'female')
			closenessScore++;
		
		if(curFriendRelationshipStatus === 'Single') {
			closenessScore += 2;
		}
		
		var insertString = "INSERT INTO FacebookFriend(Id, FacebookId, Name, Sex, RelationshipStatus, PictureUrl, City, IsInvited, ClosenessScore) VALUES(NULL,?,?,?,?,?,?,0,?)";
		db.execute(insertString, curFriend.uid+"", curFriend.name, curFriendSex, curFriendRelationshipStatus, curFriend.pic_square, curFriend.city, closenessScore); //+"" for converting long to str
	}
	db.close();
};

exports.getTopFiveFacebookFriends = function(){
	var topFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT 0,5');
	while(result.isValidRow()) {
		topFriends.push({facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
							picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
							is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
						});
		result.next();
	}
	result.close();
	db.close();
	return topFriends;
};

exports.getFacebookFriendAtIndex = function(_indexAt){
	var friend = null;
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT ?,1', _indexAt);
	if(result.isValidRow()) {
		friend = {
					facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
				  	picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
				  	is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
				};
	}
	result.close();
	db.close();
	return friend;
};

exports.getNextInvitableFacebookFriend = function(){
	var friend = null;
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT 0,1');
	if(result.isValidRow()) {
		friend = {
					facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
				  	picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
				  	is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
				};
	}
	result.close();
	db.close();
	return friend;
};

exports.getNInvitableFacebookFriend = function(_numberFriends){
	var friends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT 0,?', _numberFriends);
	while(result.isValidRow()) {
		friends.push({
					facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
				  	picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
				  	is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
				});
		result.next();
	}
	result.close();
	db.close();
	return friends;
};

exports.getFacebookFriendNextBatch = function(){
	var nextBatchFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT 0,5');
	while(result.isValidRow()) {
		nextBatchFriends.push({facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
				  				picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
				  				is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
							});
		result.next();
	}
	result.close();
	db.close();
	return nextBatchFriends;
};

exports.getFacebookFriends = function(){
	var allFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT 0,300');
	while(result.isValidRow()) {
		allFriends.push({facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
							picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
							is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
						});
		result.next();
	}
	result.close();
	db.close();
	return allFriends;
};

exports.updateIsInvited = function(_fbIdsArray) {

	if(_fbIdsArray.length === 0)
		return; 
	
	var whereStr = "(FacebookId = '" + _fbIdsArray[0]+"'";
	for(var i = 1; i < _fbIdsArray.length; i++) {
		whereStr += " OR FacebookId = '" + _fbIdsArray[i] + "'";
	}
	whereStr += ')';
	
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute("UPDATE FacebookFriend SET IsInvited = 1 WHERE "+ whereStr);
	db.close();
};

var updateClosenessScore = function(_fbId){ //???why not an array
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var updateQuery = "UPDATE FacebookFriend SET ClosenessScore = ClosenessScore + 1 WHERE FacebookId = '" + _fbId + "'";
	db.execute(updateQuery);
	db.close();
};
exports.updateClosenessScore = updateClosenessScore;

//batch update
exports.updateClosenessScoreBatch = function(_fbIdsArray) {
	var fbArray = []; 
	for(var i = 0; i < _fbIdsArray.length; i++) {
		updateClosenessScore(_fbIdsArray[i]);
	}
	Ti.App.fireEvent('facebookFriendClosenessScoreUpdated');
};

exports.updateFacebookFriendName = function(_fbId, _fbName, _fbPicUrl, _city){
	var allFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	//need to find whether there is a friend in the local db or not
	var result = db.execute('SELECT * FROM FacebookFriend WHERE FacebookId = "' + _fbId + '"');
	if(result.isValidRow()) { 	//if so, just update
		var updateQuery = 'UPDATE FacebookFriend SET Name = "' + _fbName + '" WHERE FacebookId = "' + _fbId + '"';
		db.execute(updateQuery);
	} else { //if not..do the insertion
		var insertString = "INSERT INTO FacebookFriend(Id, FacebookId, Name, PictureUrl, City, IsInvited, ClosenessScore) VALUES(NULL,?,?,?,?,0,0)";
		db.execute(insertString, _fbId, _fbName, _fbPicUrl, _city); //+"" for converting long to str
	}
	result.close();
	db.close();
	return allFriends;
};
/*		
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var dummy = []
	var result = db.execute('SELECT * FROM FacebookFriend WHERE ClosenessScore > 0 ORDER BY ClosenessScore DESC');
	while(result.isValidRow()) {
		dummy.push({facebook_id: result.fieldByName('FacebookId'), name: result.fieldByName('Name'), 
							picture_url: result.fieldByName('PictureUrl'), city: result.fieldByName('City'), 
							is_invited: result.fieldByName('IsInvited'), closeness_score: result.fieldByName('ClosenessScore')	
						});
		result.next();
	}
	result.close();
	db.close();
	Ti.API.info('after update: '+JSON.stringify(dummy));	
*/
