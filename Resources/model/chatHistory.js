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
