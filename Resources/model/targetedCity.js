var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS TargetedCity(Id INTEGER PRIMARY KEY, Name TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.populateTargetedCity = function(_targetedCityCollection) {
	if(_targetedCityCollection.length === 0)
		return;
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute('DELETE FROM TargetedCity');
	for(var i = 0; i < _targetedCityCollection.length; i++) {
		var curCity = _targetedCityCollection[i];
		db.execute("INSERT INTO TargetedCity(Id, Name) VALUES(NULL,?)", curCity);
		Ti.API.info('inserting city: '+curCity);
	}
	db.close();
};

exports.getTargetedCity = function(){
	var targetedCity = [];
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT * FROM TargetedCity');
	while(result.isValidRow()) {
		targetedCity.push(result.fieldByName('Name'));
		result.next();
	}
	result.close();
	db.close();
	return targetedCity;
};
