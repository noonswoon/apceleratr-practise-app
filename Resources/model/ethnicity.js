var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS Ethnicity(Id INTEGER PRIMARY KEY, Name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateEthnicity = function(_ethnicitiesCollection) {
	if(_ethnicitiesCollection.length === 0)
		return;
		
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM Ethnicity');
	for(var i = 0; i < _ethnicitiesCollection.length; i++) {
		var curEthnicity = _ethnicitiesCollection[i];
		db.execute("INSERT INTO Ethnicity(Id,Name) VALUES(NULL,?)", curEthnicity);
	}
	db.close();
	Ti.App.fireEvent('ethnicitiesLoaded');
};

exports.getEthnicity = function(){
	var ethnicities = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM Ethnicity');
	while(result.isValidRow()) {
		ethnicities.push(result.fieldByName('Name'));
		result.next();
	}
	result.close();
	db.close();
	return ethnicities;
};

exports.clear = function() {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM Ethnicity');
	db.close();
};