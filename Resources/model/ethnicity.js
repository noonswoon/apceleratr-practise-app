var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS ethnicities(id INTEGER PRIMARY KEY, name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateEthnicity = function(_ethnicitiesCollection) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM ethnicities');
	for(var i = 0; i < _ethnicitiesCollection.length; i++) {
		var curEthnicity = _ethnicitiesCollection[i];
		db.execute("INSERT INTO ethnicities(id,name) VALUES(NULL,?)", curEthnicity);
	}
	db.close();
	Ti.App.fireEvent('ethnicitiesLoaded');
};

exports.getEthnicity = function(){
	var ethnicities = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM ethnicities');
	while(result.isValidRow()) {
		ethnicities.push(result.fieldByName('name'));
		result.next();
	}
	result.close();
	db.close();
	return ethnicities;
};
