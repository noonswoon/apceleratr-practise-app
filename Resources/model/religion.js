var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS Religion(Id INTEGER PRIMARY KEY, Name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateReligion = function(_religionsCollection) {
	if(_religionsCollection.length === 0)
		return;
		
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM Religion');
	for(var i = 0; i < _religionsCollection.length; i++) {
		var curReligion = _religionsCollection[i];
		db.execute("INSERT INTO Religion(Id, Name) VALUES(NULL,?)", curReligion);
	}
	db.close();
	Ti.App.fireEvent('religionsLoaded');
};

exports.getReligion = function(){
	var religions = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM Religion');
	while(result.isValidRow()) {
		religions.push(result.fieldByName('Name'));
		result.next();
	}
	result.close();
	db.close();
	return religions;
};
