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
	var BackendChat = require('backend_libs/backendChat');			
	var ChatMessageTableViewRow = require('ui/handheld/Mn_ChatMessageTableViewRow');
	
	var currentChatRoom = _chatParams['chat-room']; //POPULATE on line 304
	var userObject = {id: _chatParams.userId, imageUrl: ''}; //real data --> {id: _chatParams.userId,imageUrl: ''};
	var otherUserObject = {id: _chatParams.otherUserId, imageUrl: ''}; //{id: _chatParams.otherUserId,imageUrl: ''};
	var adminUserObject = {id: '', imageUrl: 'http://dummy.com/test.png'}; //for the greet message
		
	var chatMessagesTableView = Ti.UI.createTableView({
		top:0,
		height:377,
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
		scrollable: true
	});
	
	 // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    var compareChatHistory = function(a, b) {
    	if(a.time > b.time) return -1; //เวลามากกว่า (เกิดหลัง) มาก่อนใน array
    	if(a.time < b.time) return 1; 
    	return 0;
    }
    
    var subscribe_chat_room = function() {
		//clear data
		pubnub.subscribe({
	        channel  : currentChatRoom,
	        connect  : function() {
	            Ti.API.info("connecting...");
	            var welcomeChatRow = new ChatMessageTableViewRow("Welcome to Dressntie Chat..please keep the place clean", adminUserObject, false);
	            
	            chatMessagesTableView.setData([welcomeChatRow]);
	                			
    			//load chat history data and populate into the table
				//scroll to the last one
				BackendChat.getChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId, page:1}, function(_chatHistory) {
					
					//Ti.API.info('returning from ChatHistory: '+JSON.stringify(_chatHistory));
					
					//resize image files
					var userImageView = Ti.UI.createImageView({
						image: _chatHistory.content.user_image
					});
					// Convert your imageView into a blob
					var userImageBlob = userImageView.toImage();
					userImageBlob = userImageBlob.imageAsThumbnail(60);	 
										
					var otherUserImageView = Ti.UI.createImageView({
						image: _chatHistory.content.other_user_image
					});
					// Convert your imageView into a blob
					var otherUserImageBlob = otherUserImageView.toImage();
					otherUserImageBlob = otherUserImageBlob.imageAsThumbnail(60);	 											

					userObject.imageUrl = userImageBlob;
					otherUserObject.imageUrl = otherUserImageBlob; 
					
					//need to sort messages array
					var historyMessages = _chatHistory.content.chat_messages; 
					historyMessages.sort(compareChatHistory);
					
					for(var i = 0; i < historyMessages.length; i++) {
						//Ti.API.info('time: '+ historyMessages[i].time+', mesage: '+historyMessages[i].message);
						var historyUserObj = otherUserObject; 
						var isYourMessage = false;
						//Ti.API.info('senderId: '+historyMessages[i].sender_id +', userId: '+userObject.id);
						if(historyMessages[i].sender_id == userObject.id) {
							isYourMessage = true;
							historyUserObj = userObject;
							//Ti.API.info('setting to myMessage');
						}
						var newChatRow = new ChatMessageTableViewRow(historyMessages[i].message,historyUserObj,isYourMessage);
			          	chatMessagesTableView.insertRowAfter(0,newChatRow);
					}
					chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
				});
	        },
	        callback : function(message) {
	        	//since pubnub is a broadcaster, sender will receive his own message as well
	        	//prevent from having the user sees his own message when it got broadcasted
	        	if(userObject.id !== message.senderId) {
					Ti.Media.vibrate(); //i love things that shake!
					var senderObj = {id: message.senderId, imageUrl: otherUserObject.imageUrl,time:Ti.App.moment().format('YYYY-MM-DD, HH:mm:ss')}
	           		var newChatRow = new ChatMessageTableViewRow(message.text,senderObj,false);
	           		chatMessagesTableView.appendRow(newChatRow);
	           	   	setTimeout(function() {
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
		BackendChat.saveChatMessage(messageObj, function(e) {
			if(e.success) Ti.API.info('save chat successful');
			else Ti.API.info('save chat failed');
		});

		//need to check with MatchResponseDetail to see if profile is ok with receiving the message from targetedProfile
		//checking on the perspective of the receiver not sender
		BackendChat.sendNotification(messageObj, function() {
			if(e.success) Ti.API.info('send notif successful');
			else Ti.API.info('send notif failed');
		}); //might or might not able to send
		
        pubnub.publish({
            channel  : currentChatRoom,
            message  : { text : message, senderId: userObject.id},
            callback : function(info) {
                if (!info[0]) setTimeout(function() {
                    send_a_message(message)
                }, 2000 );
            }
        });
    };
    
    var profileButton = Ti.UI.createButton({
        systemButton:Titanium.UI.iPhone.SystemButton.COMPOSE,
		left: 10,
		width: 30,
		height: 30,
		top: 10
	});

	var chatWindow = Ti.UI.createWindow({
		title: 'Chat with '+_chatParams.otherUserFirstName,
		backgroundImage: 'images/bg.png',
		rightNavButton: profileButton,
//		barImage: 'images/nav_bg_w_pattern.png',
//		backgroundImage: 'images/bg.png',
//		barColor:'#489ec3',
	});

	var loadHistoryMessagesRow = Ti.UI.createTableViewRow({
		top: 7,
		height: 30
	});
	if(Ti.Platform.osname === 'iphone')
		loadHistoryMessagesRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var loadHistoryButton = Ti.UI.createButton({
		width: 150,
		height: 26,
		backgroundImage: 'images/chat/loadearliermessage.png'
	});
	loadHistoryMessagesRow.add(loadHistoryButton);
	
	var chatInputView = Ti.UI.createView({
		bottom: 0,
		height: 40,
		width: '100%',
		zIndex: 2,
		backgroundImage: 'images/chat/footerBG.png'
	});
	
	var chatInputTextField   = Ti.UI.createTextArea({
        width: 237,
        height: 30,
        left: 10,
        color: "#111",
        value: "",
        font: {fontSize:14},
        textAlign: 'left',
        backgroundColor: 'transparent',
        backgroundImage: 'images/chat/chattextfieldBG.png'
    });
	
    // Send Button
    var sendButton = Ti.UI.createImageView({
		width: 60,
		height: 31,
		right: 10,
		image: 'images/chat/send.png'
    });
    
	chatInputView.add(chatInputTextField);
	chatInputView.add(sendButton);
	
	chatWindow.add(chatMessagesTableView);
	chatWindow.add(chatInputView);
	
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
		chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
		chatMessagesTableView.animate(animateNegativeUp_chatView);
	//	chatInputView.top = 140;
		chatInputView.animate(animateUp_inputView);
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		chatMessagesTableView.animate(animateDown_chatView);
	//	chatInputView.top = 375;
		chatInputView.animate(animateDown_inputView);
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    sendButton.addEventListener('click', function() {
		if(chatInputTextField.value === "")
			return;

		var newChatRow = new ChatMessageTableViewRow(chatInputTextField.value,userObject,true);
        chatMessagesTableView.appendRow(newChatRow);
        		
		send_a_message(chatInputTextField.value);
	
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	setTimeout(function() {
			   	chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1); //fixing stuff here scroll to the latest row
		}, 500); 	
    });
	
	profileButton.addEventListener('click', function() {
		Ti.API.info('open profile click');
		Ti.App.fireEvent('openProfileWindow', {matchId: _chatParams.matchId});
	});
	chatWindow.addEventListener('close', function(){
		//unsubscribe here...
		Ti.API.info('unsubscribe from channel: '+currentChatRoom);
		pubnub.unsubscribe({ channel : currentChatRoom });
	});	
	
	subscribe_chat_room();
	
    return this;
};

