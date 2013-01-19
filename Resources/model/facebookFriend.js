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
db.execute('CREATE TABLE IF NOT EXISTS FacebookFriend(Id INTEGER PRIMARY KEY, FacebookId TEXT, Name TEXT, PictureUrl TEXT, City TEXT, IsInvited INTEGER, ClosenessScore INTEGER);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateFacebookFriend = function(_friendsCollection) {
	Ti.API.info('populating facebook friend...');
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM FacebookFriend');
	for(var i = 0; i < _friendsCollection.length; i++) {
		var curFriend = _friendsCollection[i];
		var insertString = "INSERT INTO FacebookFriend(Id, FacebookId, Name, PictureUrl, City, IsInvited, ClosenessScore) VALUES(NULL,?,?,?,?,0,0)";
		db.execute(insertString, curFriend.uid+"", curFriend.name, curFriend.pic_square, curFriend.city); //+"" for converting long to str
	}
	db.close();
//	Ti.App.fireEvent('ethnicitiesLoaded');	
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
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC LIMIT '+_indexAt+',1');
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

exports.getFacebookFriends = function(){
	var allFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore DESC');
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
	for(var i = 0; i < _fbIdsArray.length; i++)
		updateClosenessScore(_fbIdsArray[i]);

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
}
