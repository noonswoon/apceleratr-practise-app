var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS ChatHistory(Id INTEGER PRIMARY KEY, MatchId INTEGER, UserId INTEGER, TargetedUserId INTEGER, SenderId INTEGER, ReceiverId INTEGER, Message TEXT, Time TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.insertChatMessage = function(chatMessageObj) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	
	//check first if we need to insert such a record
	var matchId = chatMessageObj.matchId;
	var userId = chatMessageObj.userId;
	var targetedUserId = chatMessageObj.targetedUserId; 
	var senderId = chatMessageObj.senderId;
	var receiverId = chatMessageObj.receiverId;
	var message = chatMessageObj.message;
	var sentTime = chatMessageObj.time;
		
	db.execute("INSERT INTO ChatHistory(Id, MatchId, UserId, TargetedUserId, SenderId, ReceiverId, Message, Time) VALUES(NULL,?,?,?,?,?,?,?)", matchId, userId, targetedUserId, senderId, receiverId, message, sentTime);	
	db.close();
};

exports.getChatHistory = function(_matchId) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var chatMessages = [];
	var result = db.execute("SELECT * FROM ChatHistory WHERE MatchId = ? ORDER BY Time DESC", _matchId);
	while(result.isValidRow()) {
		chatMessages.push({senderId: result.fieldByName('SenderId'), receiverId: result.fieldByName('ReceiverId'), message: result.fieldByName('Message'), time: result.fieldByName('Time')});
		result.next();
	}
	result.close();
	db.close();

	return chatMessages;
};

exports.migrateData = function() {
	//drop table then recreate it
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	var chatMessages = [];
	var result = db.execute("SELECT * FROM ChatHistory");
	var numChatsInDb = 0;
	while(result.isValidRow()) {
		var chatObj = {}; 
		if(result.fieldByName('MatchId') !== undefined && result.fieldByName('MatchId') !== null) {
			chatObj.matchId = result.fieldByName('MatchId'); 
			chatObj.userId = result.fieldByName('UserId'); 
			chatObj.targetedUserId = result.fieldByName('TargetedUserId'); 
			chatObj.senderId = result.fieldByName('SenderId'); 
			chatObj.receiverId = result.fieldByName('ReceiverId'); 
			chatObj.message = result.fieldByName('Message'); 
			chatObj.time = result.fieldByName('Time'); 
			chatMessages.push(chatObj);
		} //else //ignore msg that does not have matchId
		result.next();
		numChatsInDb++;
	}
	//alert('numChatsInDb before migrate: '+numChatsInDb);
	
	db.execute("DROP TABLE IF EXISTS ChatHistory");
	
	db.execute('CREATE TABLE ChatHistory(Id INTEGER PRIMARY KEY, MatchId INTEGER, UserId INTEGER, TargetedUserId INTEGER, SenderId INTEGER, ReceiverId INTEGER, Message TEXT, Time TEXT);');
	var numChatsMigrated = 0;
	for(var i = 0; i < chatMessages.length; i++) {
		
		var chatObj = chatMessages[i]; 
		var matchId = chatObj.matchId;
		var userId = chatObj.userId;
		var targetedUserId = chatObj.targetedUserId; 
		var senderId = chatObj.senderId;
		var receiverId = chatObj.receiverId;
		var message = chatObj.message;
		var sentTime = chatObj.time;
		db.execute("INSERT INTO ChatHistory(Id, MatchId, UserId, TargetedUserId, SenderId, ReceiverId, Message, Time) VALUES(NULL,?,?,?,?,?,?,?)", matchId, userId, targetedUserId, senderId, receiverId, message, sentTime);	
		numChatsMigrated++;
	}
	//alert('numChatsMigrated: '+numChatsMigrated);
	
	result.close();
	db.close();
};
