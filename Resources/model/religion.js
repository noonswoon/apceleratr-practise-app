var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS religions(id INTEGER PRIMARY KEY, name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateReligion = function(_religionsCollection) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM religions');
	for(var i = 0; i < _religionsCollection.length; i++) {
		var curReligion = _religionsCollection[i];
		db.execute("INSERT INTO religions(id,name) VALUES(NULL,?)", curReligion);
	}
	db.close();
	Ti.App.fireEvent('religionsLoaded');
};

exports.getReligion = function(){
	var religions = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM religions');
	while(result.isValidRow()) {
		religions.push(result.fieldByName('name'));
		result.next();
	}
	result.close();
	db.close();
	return religions;
};
