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
		db.execute(insertString, curFriend.uid+"", curFriend.name, curFriend.pic_square, curFriend.city);
	}
	db.close();
//	Ti.App.fireEvent('ethnicitiesLoaded');	
};

exports.getTopFiveFacebookFriends = function(){
	var topFriends = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore ASC LIMIT 0,5');
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
//SELECT * FROM FacebookFriend WHERE IsInvited = 0 ORDER BY ClosenessScore ASC LIMIT _indexAt, 1
};

exports.getFacebookFriendInCity = function(_cityArray){
//SELECT * FROM FacebookFriend WHERE IsInvited = 0 AND (Location = "" OR Location = "" OR Location = "") ORDER BY ClosenessScore ASC LIMIT _indexAt, 1
};

exports.updateIsInvited = function(_fbIds){
//UPDATE SET IsInvited = 1
};
