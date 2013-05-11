var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS MetaData(Name TEXT, Value TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.insertDbVersion = function(versionStr) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute("INSERT INTO MetaData(Name, Value) VALUES(?,?)", 'dbVersion', versionStr);
	db.close();
};

exports.updateDbVersion = function(versionStr) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	db.execute("UPDATE MetaData SET Value = ? WHERE Name = ?", versionStr, 'dbVersion');
	db.close();
};

exports.getDbVersion = function(){
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var result = db.execute('SELECT Value FROM MetaData where Name = ?', 'dbVersion');
	var currentDbVersion = '';
	if(result.isValidRow()) {
		currentDbVersion = result.fieldByName('Value'); 
	}
	result.close();
	db.close();
	return currentDbVersion;
};
