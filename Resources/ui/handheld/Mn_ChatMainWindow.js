// ----------------------------------
// INCLUDE PUBNUB
// ----------------------------------
	Ti.include('../../external_libs/pubnub.js');
	
	// ----------------------------------
	// INIT PUBNUB
	// ----------------------------------
	var pubnub = Ti.PubNub.init({
	    publish_key   : 'pub-5d5a8d08-52e1-4011-b632-da2a91d6a2b9',
	    subscribe_key : 'sub-de622063-9eb3-11e1-8dea-0b2d0bf49bb9',
	    ssl           : false,
	    origin        : 'pubsub.pubnub.com'
	});
	
Ti.App.Chat = function(_chatParams) {    
	var ModelChatHistory = require('model/chatHistory');
	var BackendChat = require('backend_libs/backendChat');			
	var ChatMessageTableViewRow = require('ui/handheld/Mn_ChatMessageTableViewRow');
	var UserProfileWindowModule = require('ui/handheld/Mn_UserProfileWindow');
	
	var currentChatRoom = _chatParams['chat-room']; //POPULATE on line 304
	var userObject = {id: _chatParams.userId, imageUrl: _chatParams.userImage}; //real data --> {id: _chatParams.userId,imageUrl: ''};
	var otherUserObject = {id: _chatParams.otherUserId, imageUrl: _chatParams.otherUserImage}; //{id: _chatParams.otherUserId,imageUrl: ''};
	var navGroup = _chatParams.navGroup;
	var nextHistoryPage = 2;
	var otherUserGuid =  _chatParams.otherUserGuid;
	var cartoonMsgs = [	"Nice to meet you! However, I am just a cartoon.", 
						"I would love to meet up with you if I am a person.",
						"Can you come to the cartoon world?"];
	var cartoonIndexMsg = 0;
/*
	var userImageView = Ti.UI.createImageView({
		image: _chatParams.userImage
	});
					
	// Convert your imageView into a blob
	var userImageBlob = userImageView.toImage();
	userImageBlob = userImageBlob.imageAsThumbnail(35);	 
											
	var otherUserImageView = Ti.UI.createImageView({
		image: _chatParams.otherUserImage
	});
	// Convert your imageView into a blob
	var otherUserImageBlob = otherUserImageView.toImage();
	otherUserImageBlob = otherUserImageBlob.imageAsThumbnail(35);	 											

	userObject.imageUrl = userImageBlob;
	otherUserObject.imageUrl = otherUserImageBlob; 
*/	
	var chatMessagesTableView = Ti.UI.createTableView({
		top:0,
		height:377,
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
		scrollable: true
	});
	
	 var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		top: 7,
		height: 50,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	if(Ti.Platform.osname === 'iphone')
		loadHistoryMessagesRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var loadMoreView = Ti.UI.createImageView({
		image: 'images/done-button.png',
		width: 100,
		height: 27,
		zIndex: 5,
		center: {x:'50%',y:'50%'}
	});
	
	var moreText = Ti.UI.createLabel({
		text: 'Load more...', 
		center: {x:'50%', y:'50%'},
		color: '#e6e6e6', 
		font:{fontWeight:'bold',fontSize:12},
	});
	loadMoreView.add(moreText);
	loadHistoryMessagesRow.add(loadMoreView);
	
	moreText.addEventListener('click', function() {
		BackendChat.getChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId, page:nextHistoryPage}, function(_chatHistory) {
			var chatHistoryMsgs = _chatHistory.content.chat_messages;
			for(var i = 0; i < chatHistoryMsgs.length; i++) {
				var messageObj = {};
				messageObj.userId = userObject.id;
				messageObj.targetedUserId = otherUserObject.id;
				messageObj.senderId = chatHistoryMsgs[i].sender_id;
				messageObj.receiverId = chatHistoryMsgs[i].receiver_id;
				messageObj.message = chatHistoryMsgs[i].message;
				messageObj.time = chatHistoryMsgs[i].time;
				ModelChatHistory.insertChatMessage(messageObj);
			}
			var pageOffset = (nextHistoryPage - 1) * 10;
			var chatHistory = ModelChatHistory.getChatHistory({userId:_chatParams.userId, targetedUserId:_chatParams.otherUserId}, pageOffset);		
			for(var i = 0; i < chatHistory.length; i++) { //fixing this
				var historyUserObj = otherUserObject; 
				var isYourMessage = false;
				if(chatHistory[i].senderId == userObject.id) {
					isYourMessage = true;
					historyUserObj = userObject;
				}
				var newChatRow = new ChatMessageTableViewRow(chatHistory[i].message,historyUserObj,isYourMessage);
				chatMessagesTableView.insertRowAfter(0,newChatRow);
			}
			nextHistoryPage++;
		});
	});
	
	var repopulateChatTable = function() {
		chatMessagesTableView.setData([loadHistoryMessagesRow]);
	    
	    //load chat history data and populate into the table
		//scroll to the last one
		var chatHistory = ModelChatHistory.getChatHistory({userId:_chatParams.userId, targetedUserId:_chatParams.otherUserId}, 0);		
		for(var i = 0; i < chatHistory.length; i++) { //fixing this
			var historyUserObj = otherUserObject; 
			var isYourMessage = false;
			if(chatHistory[i].senderId == userObject.id) {
				isYourMessage = true;
				historyUserObj = userObject;
			}
			var newChatRow = new ChatMessageTableViewRow(chatHistory[i].message,historyUserObj,isYourMessage);
			chatMessagesTableView.insertRowAfter(0,newChatRow);
		}
		chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
	};
	
	Ti.App.addEventListener('updateChatData', function() {
		Ti.API.info('listening at updateChatData event');
		repopulateChatTable();
	});
	 // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    var compareChatHistory = function(a, b) {
    	if(a.time < b.time) return -1; //เวลาน้อยกว่า (เกิดก่อน) มาก่อนใน array
    	if(a.time > b.time) return 1; 
    	return 0;
    }
    
    var subscribe_chat_room = function() {
		//clear data
		pubnub.subscribe({
	        channel  : currentChatRoom,
	        connect  : function() {
	            Ti.API.info("connecting...");
	            repopulateChatTable();
				BackendChat.getChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId, page:1}, function(_chatHistory) {
					var isNewRecord = false;
					var chatHistoryMsgs = _chatHistory.content.chat_messages;
					for(var i = 0; i < chatHistoryMsgs.length; i++) {
						//Ti.API.info('chatHistoryMsg: '+JSON.stringify(chatHistoryMsgs[i]));
						var messageObj = {};
						messageObj.userId = userObject.id;
						messageObj.targetedUserId = otherUserObject.id;
						messageObj.senderId = chatHistoryMsgs[i].sender_id;
						messageObj.receiverId = chatHistoryMsgs[i].receiver_id;
						messageObj.message = chatHistoryMsgs[i].message;
						messageObj.time = chatHistoryMsgs[i].time;
						var insertResult = ModelChatHistory.insertChatMessage(messageObj);			
						if(insertResult)
							isNewRecord = true;
					}
					if(isNewRecord) {
						Ti.App.fireEvent('updateChatData');
					}
				});
	        },
	        callback : function(message) {
	        	//since pubnub is a broadcaster, sender will receive his own message as well
	        	//prevent from having the user sees his own message when it got broadcasted
	        	if(userObject.id !== message.senderId) {
					Ti.Media.vibrate(); //i love things that shake!
					var senderObj = {id: message.senderId, imageUrl: otherUserObject.imageUrl,time:message.time};
	           		var newChatRow = new ChatMessageTableViewRow(message.text,senderObj,false);
	           		chatMessagesTableView.appendRow(newChatRow);
	           		
	           	   	setTimeout(function() {
	           	   		if(chatMessagesTableView.data[0] !== undefined && chatMessagesTableView.data[0].rowCount > 0)
				   			chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //add some delay-fixing stuff here scroll to the latest row
					}, 1000);
	           	}
	        },
	        error : function() {
	       		Ti.API.info("Lost connection...");
	        }
	    });
    };
    
     // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    var send_a_message = function(message) {
        if (!message) return;

		//send to server to save to db
		var messageObj = {}; 
		messageObj.matchId = _chatParams.matchId
		messageObj.message = message; 
		messageObj.senderId = userObject.id;
		messageObj.receiverId = otherUserObject.id; 
		BackendChat.saveChatMessage(messageObj, function(_sentData) {
			//save to localdb
			var messageObj = {};
			messageObj.userId = userObject.id;
			messageObj.targetedUserId = otherUserObject.id;
			/*
			messageObj.senderId = userObject.id;
			messageObj.receiverId = otherUserObject.id;
			messageObj.message = message;
			messageObj.time = Ti.App.moment().format('YYYY-MM-DDTHH:mm:ss');
			*/
			
			messageObj.senderId = _sentData.sender_id;
			messageObj.receiverId = _sentData.receiver_id;
			messageObj.message = _sentData.message;
			messageObj.time = _sentData.time;
			
			ModelChatHistory.insertChatMessage(messageObj);		
			pubnub.publish({
	            channel  : currentChatRoom,
	            message  : { text : message, senderId: userObject.id, time: messageObj.time},
	            callback : function(info) {
	                if (!info[0]) setTimeout(function() {
	                    send_a_message(message)
	                }, 2000 );
	            }
	        });
		});

		//need to check with MatchResponseDetail to see if profile is ok with receiving the message from targetedProfile
		//checking on the perspective of the receiver not sender
		BackendChat.sendNotification(messageObj, function(e) {
			if(e.success) Ti.API.info('send push notif successfully');
		}); //might or might not able to send
    };
    
    var profileButton = Ti.UI.createButton({
    	backgroundImage: 'images/top-bar-button.png',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-profile.png',
	});

	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var chatWindow = Ti.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		title: 'Chat with '+_chatParams.otherUserFirstName,
		navBarHidden: false,
		backgroundColor: '#eeeeee',
		leftNavButton: backButton,
		rightNavButton: profileButton,
	});

	backButton.addEventListener('click', function() {
		navGroup.close(chatWindow, {animated:true}); //go to the main screen
	});
	
	var chatInputView = Ti.UI.createView({
		bottom: 0,
		height: 41,
		width: '100%',
		zIndex: 2,
		backgroundImage: 'images/chat/chat-bar-background.png'
	});

	var chatSendButtonLeft = Ti.UI.createImageView({
		image: 'images/chat/green-button-left.png',
		top: 8,
		left: 256,
		width: 12, 
		height: 26,
	});
	chatInputView.add(chatSendButtonLeft);
	
	var chatSendButtonCenter = Ti.UI.createImageView({
		image: 'images/chat/green-button-middle.png',
		top: 8,
		left: 256 + 12,
		width: 37, 
		height: 26,
	});
	chatInputView.add(chatSendButtonCenter);
	
	var chatSendButtonRight = Ti.UI.createImageView({
		image: 'images/chat/green-button-right.png',
		top: 8,
		left: 256 + 12 + 37,
		width: 12, 
		height: 26,
	});
	chatInputView.add(chatSendButtonRight);
	
	var sendLabel = Ti.UI.createLabel({
		text: 'Send', 
		top: 12,
		left: 256 + 13,
		color: '#a8c98e', 
		shadowColor: '#6ba333',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		zIndex:3
	});
	chatInputView.add(sendLabel);
	
	var chatInputTextField   = Ti.UI.createTextArea({
        top: 8,
        left: 10,
        width: 237,
        height: 30,
        value: "",
        font: {fontSize:14},
        textAlign: 'left',
        backgroundColor: 'transparent',
        backgroundImage: 'images/chat/chat-textarea-background.png',
        zIndex: 4,
    });
	chatInputView.add(chatInputTextField);

	var hintTextLabel = Ti.UI.createLabel({
		text: 'Message', 
		top: 12,
		left: 24,
		color: '#ababab', 
		font:{fontSize:14},
		zIndex:4,
		
	});
	chatInputView.add(hintTextLabel);
		
	chatWindow.add(chatInputView);    	
	chatWindow.add(chatMessagesTableView);
	
	this.chatWindow = chatWindow;
    this.pubnub      = pubnub;
    
    	//animate up
	var animateNegativeUp_chatView = Ti.UI.createAnimation({
		top: -230,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_chatView = Ti.UI.createAnimation({
		top: 0,
		duration: 350,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	var animateUp_inputView = Ti.UI.createAnimation({
		top: 140,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_inputView = Ti.UI.createAnimation({
		top: 375,
		duration: 350,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	chatInputTextField.addEventListener('focus', function() {
		if(chatMessagesTableView.data[0] !== undefined && chatMessagesTableView.data[0].rowCount > 0) {
			chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
		}
		hintTextLabel.visible = false;
		sendLabel.color = '#ffffff';
		chatMessagesTableView.animate(animateNegativeUp_chatView);
		chatInputView.animate(animateUp_inputView);
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		if(chatInputTextField.value === "") { 
			sendLabel.color = '#a8c98e';
			hintTextLabel.visible = true;
		}
		chatMessagesTableView.animate(animateDown_chatView);
		chatInputView.animate(animateDown_inputView);
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    sendLabel.addEventListener('click', function() {
		if(chatInputTextField.value === "")
			return;

		var newChatRow = new ChatMessageTableViewRow(chatInputTextField.value,userObject,true);
        chatMessagesTableView.appendRow(newChatRow);
		
		//check if it is just the cartoon, if so don't send the message
		Ti.API.info('otherUserGuid: '+otherUserGuid);
		if(otherUserGuid === "") { //normal user has an empty guid
			send_a_message(chatInputTextField.value);
		} else {
			var cartoonChatBackRow = new ChatMessageTableViewRow(cartoonMsgs[cartoonIndexMsg],otherUserObject,false);
			cartoonIndexMsg++;
			chatMessagesTableView.appendRow(cartoonChatBackRow);
			if(cartoonIndexMsg >= cartoonMsgs.length) 
				cartoonIndexMsg = 0;
		}
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	setTimeout(function() {
    		if(chatMessagesTableView.data[0] !== undefined && chatMessagesTableView.data[0].rowCount > 0)
    			chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
		}, 500); 	
    });
	
	profileButton.addEventListener('click', function() {
		//Ti.API.info('open profile click');
		
		var userProfileWindow = new UserProfileWindowModule(navGroup, userObject.id, otherUserObject.id);
		navGroup.open(userProfileWindow, {animated:true});
	});
	
	chatWindow.addEventListener('close', function(){
		//unsubscribe here...
		Ti.API.info('unsubscribe from channel: '+currentChatRoom);
		pubnub.unsubscribe({ channel : currentChatRoom });
	});	
	
	subscribe_chat_room();
	
    return this;
};
