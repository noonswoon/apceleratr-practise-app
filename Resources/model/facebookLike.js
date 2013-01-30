var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS FacebookLike(Id INTEGER PRIMARY KEY, UserId Integer, Category Text, Name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateFacebookLike = function(_userId, _targetedUserId, _fbLikeCollection) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME);
	if(_userId === _targetedUserId) {
		db.execute('DELETE FROM FacebookLike'); //delete all
	} else {
		db.execute('DELETE FROM FacebookLike WHERE UserId <> ?', _userId); //delete other people except the owner's like
	}

	Ti.API.info('inserting..userId: '+ _targetedUserId +', _fbLikeCollection.length: '+_fbLikeCollection.length);	
	for(var i = 0; i < _fbLikeCollection.length; i++) {
		var curFbLike = _fbLikeCollection[i];
		db.execute("INSERT INTO FacebookLike(Id, UserId, Category, Name) VALUES(NULL, ? , ? , ? )", _targetedUserId, curFbLike.category, curFbLike.name);
	}

	db.close();
};

exports.getFiveRandomFacebookLike = function(_userId){
	var fbLikes = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM FacebookLike WHERE UserId = ? AND length(Name) <= 15 ORDER BY RANDOM() LIMIT 0,5', _userId);
	Ti.API.info('userId of get5Random: '+_userId);
	while(result.isValidRow()) {
		fbLikes.push({category: result.fieldByName('Category'), name: result.fieldByName('Name')});
		result.next();
	}
	result.close();
	db.close();
	Ti.API.info('fbLikes.length: '+fbLikes.length);
	return fbLikes;
};

/*
	var dummy = []
	var result = db.execute('SELECT * FROM FacebookLike');
	while(result.isValidRow()) {
		dummy.push({"category": result.fieldByName('Category'), "name": result.fieldByName('Name')});
		result.next();
	}
	result.close();
	Ti.API.info('FacebookLike after insert for userId: '+_targetedUserId + ', '+JSON.stringify(dummy));
*/