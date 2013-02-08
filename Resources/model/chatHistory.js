var db = Ti.Database.open(Ti.App.DATABASE_NAME);
db.execute('CREATE TABLE IF NOT EXISTS ChatHistory(Id INTEGER PRIMARY KEY, UserId INTEGER, TargetedUserId INTEGER, SenderId INTEGER, ReceiverId INTEGER, Message TEXT, Time TEXT);');
db.close();

// MY CHECKIN PART
// create data for local database
exports.insertChatMessage = function(chatMessageObj) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	
	//check first if we need to insert such a record
	var senderId = chatMessageObj.senderId;
	var receiverId = chatMessageObj.receiverId;
	var sentTime = chatMessageObj.time;
	
	var result = db.execute('SELECT Id FROM ChatHistory WHERE Time = "'+sentTime+'" AND SenderId =' + senderId +' AND ReceiverId =' + receiverId);
	var isExisted = false;
	if(result.isValidRow()) {
		isExisted = true;
	}
	
	if(isExisted) {
		result.close();
		db.close();
		return false;
	} 
	
	var userId = chatMessageObj.userId;
	var targetedUserId = chatMessageObj.targetedUserId; 
	
	var message = chatMessageObj.message;
	
	db.execute("INSERT INTO ChatHistory(Id, UserId, TargetedUserId, SenderId, ReceiverId, Message, Time) VALUES(NULL,?,?,?,?,?,?)", userId, targetedUserId, senderId, receiverId, message, sentTime);
	
	db.close();
	return true;
};

exports.getChatHistory = function(connectionObj, pageOffset) {
	var db = Ti.Database.open(Ti.App.DATABASE_NAME); 
	
	var userId = connectionObj.userId;
	var targetedUserId = connectionObj.targetedUserId;
	
	var chatMessages = [];
	var result = db.execute('SELECT * FROM ChatHistory WHERE UserId = ' +userId+' AND TargetedUserId = '+targetedUserId + ' ORDER BY Time DESC LIMIT '+pageOffset+', 10');
	while(result.isValidRow()) {
		chatMessages.push({senderId: result.fieldByName('SenderId'), receiverId: result.fieldByName('ReceiverId'), message: result.fieldByName('Message'), time: result.fieldByName('Time')});
		result.next();
	}
	result.close();
	db.close();

	return chatMessages;
};
