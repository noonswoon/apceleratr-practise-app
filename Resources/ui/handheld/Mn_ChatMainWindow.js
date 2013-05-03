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
	Ti.App.Flurry.logTimedEvent('chat-screen');
	
//	var ModelChatHistory = require('model/chatHistory');
	var BackendChat = require('backend_libs/backendChat');			
	var ChatMessageTableViewRow = require('ui/handheld/Mn_ChatMessageTableViewRow');
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');	
	
	var currentChatRoom = _chatParams['chat-room']; //POPULATE on line 304
	//Ti.API.info('currentChatRoom: '+currentChatRoom);
	var hasSentMessage = true;
	
	if(!Ti.App.Properties.hasProperty('chat-first-enter-room' + currentChatRoom)) {
		Ti.App.Flurry.logEvent('chat-first-enter-room');	
		Ti.App.Properties.setInt('chat-first-enter-room' + currentChatRoom, 1);
	}
	
	if(!Ti.App.Properties.hasProperty('chat-first-sent-msg' + currentChatRoom)) {
		hasSentMessage = false;
	}
	
	var userObject = {id: _chatParams.userId, imageUrl: _chatParams.userImage}; //real data --> {id: _chatParams.userId,imageUrl: ''};
	var otherUserGuid =  _chatParams.otherUserGuid;
	var otherUserObject = {id: _chatParams.otherUserId, imageUrl: _chatParams.otherUserImage}; //{id: _chatParams.otherUserId,imageUrl: ''};
	var navGroup = _chatParams.navGroup;
	var cartoonMsgs = [	L("Nice to meet you! However, I am just a cartoon."), 
						L("I would love to meet up with you if I were a real person."),
						L("Can you come to the cartoon world?")];
	var cartoonIndexMsg = 0;

	var tableHeight = 376; //480 - 20 (status bar) - 44 (nav bar) - 40 (input view)
	var listViewHeight = 376; 
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		tableHeight = 464; // 568 - 57 = 511
		listViewHeight = 464;
	}

	var sideOffset = 49; 
	var horizontalLength = 188;  
	var verticalLength = 1;
	
	var chatTemplate = {
		properties: {
			selectionStyle: Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
			//height: Titanium.UI.FILL,
		},
		childTemplates: [
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'userPic', 
				properties: {
					left: 7, 
					center: {y:'50%'},
					width: 34, 
					height: 34, 
					touchEnabled: false, 
					borderWidth: 1, 
					borderRadius: 2, 
					borderColor: '#d5d5d5',
				}
			}, 
			{
				type: 'Ti.UI.Label', 
				bindId: 'chatMessage', 
				properties: {
					left: sideOffset,
					textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
					center: {y:'50%'},
					width: 240,
					font: {fontSize: 14, fontFamily: 'Helvetica Neue'},
					zIndex: 2
				}
			},
		]
	};

	var chatListView = Ti.UI.createListView({
		top: 0, 
		height: listViewHeight,
		templates: {'chatTemplate': chatTemplate},
		defaultItemTemplate: 'chatTemplate',
	});
	
	var listSection = null;
	
	var chatData = []; 

	var chatMessagesTableView = Ti.UI.createTableView({
		top: 0,
		height: tableHeight,
		backgroundColor: 'transparent',
		separatorColor: 'transparent',
		scrollable: true
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
		if(otherUserGuid === "") { //normal user has an empty guid, only subscribe if normal user
			pubnub.subscribe({
		        channel  : currentChatRoom,
		        connect  : function() {
		            Ti.API.info("connecting...");
					BackendChat.getChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId, page:1}, function(_chatHistory) {
						var chatHistoryMsgs = _chatHistory.content.chat_messages;
						if(chatHistoryMsgs.length > 0) {
							for(var i = 0; i < chatHistoryMsgs.length; i++) {
								//Ti.API.info('chatHistoryMsg: '+JSON.stringify(chatHistoryMsgs[i]));
								var messageObj = {};
								messageObj.userId = userObject.id;
								messageObj.targetedUserId = otherUserObject.id;
								messageObj.senderId = chatHistoryMsgs[i].sender_id;
								messageObj.receiverId = chatHistoryMsgs[i].receiver_id;
								messageObj.message = chatHistoryMsgs[i].message;
								messageObj.time = chatHistoryMsgs[i].time;
								
								//adding history to the table
								var senderObj = {};
								var isUserASender = false;
								senderObj.id = messageObj.senderId;
								senderObj.time = messageObj.time;
								
								var numLines = Math.ceil(chatHistoryMsgs[i].message.length / 28);
								var rowHeight = 40 + (numLines - 1) * 10;
								if(userObject.id === messageObj.senderId) { 
									senderObj.imageUrl = _chatParams.userImage;
									isUserASender = true;
									chatData.push({
										properties: {backgroundColor: '#e0e0e0', height: rowHeight}, //#ededed
										userPic: { image: senderObj.imageUrl},
										chatMessage: { text: chatHistoryMsgs[i].message, color: '#818181'},
										time: messageObj.time
									});	
								} else {
									senderObj.imageUrl = _chatParams.otherUserImage;
									isUserASender = false;
									chatData.push({
										properties: {backgroundColor: '#e0e0e0', height: rowHeight}, //#f6f6f6
										userPic: { image: senderObj.imageUrl},
										chatMessage: { text: chatHistoryMsgs[i].message, color: '#0b0208'},
										time: messageObj.time
									});	
								}
							}
						}
						
						//sort the chat data
						chatData.sort(compareChatHistory);
						
						listSection = Ti.UI.createListSection({items: chatData});
						chatListView.sections = [listSection];
						setTimeout(function() {
							chatListView.scrollToItem(0, chatData.length - 1);
						}, 500);
					});
		        },
		        callback : function(message) {
		        	//since pubnub is a broadcaster, sender will receive his own message as well
		        	//prevent from having the user sees his own message when it got broadcasted
		        	if(userObject.id !== message.senderId) {
						Ti.Media.vibrate(); //i love things that shake!
						var senderObj = {id: message.senderId, imageUrl: otherUserObject.imageUrl,time:message.time};
		           		
		           		var numLines = Math.ceil(message.text.length / 28);
						var rowHeight = 40 + (numLines - 1) * 10;
		
		           		//will have to change here to listView
		           		chatData.push({
							properties: {backgroundColor: '#f6f6f6', height: rowHeight},
							userPic: { image: senderObj.imageUrl},
							chatMessage: { text: message.text},
							time: message.time
						});	
						listSection.items = chatData;
						
						setTimeout(function() {
							chatListView.scrollToItem(0, chatData.length - 1);
						}, 500);
					}
		        },
		        error : function() {
		       		Ti.API.info("Lost connection...");
		        }
		    });
		} else {
			listSection = Ti.UI.createListSection({items: chatData});
			chatListView.sections = [listSection];
		}
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
			messageObj.senderId = _sentData.sender_id;
			messageObj.receiverId = _sentData.receiver_id;
			messageObj.message = _sentData.message;
			messageObj.time = _sentData.time;
			
//			ModelChatHistory.insertChatMessage(messageObj);		
			if(!hasSentMessage) {
				Ti.App.Flurry.logEvent('chat-first-sent-msg');
				Ti.App.Properties.setInt('chat-first-sent-msg' + currentChatRoom, 1);
				hasSentMessage = true;
			}
			
			pubnub.publish({
	            channel  : currentChatRoom,
	            message  : { text : message, senderId: userObject.id, time: messageObj.time},
	            callback : function(info) {
	            	Ti.API.info('publish callback: '+JSON.stringify(info));
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
		title: L('Chat with') + ' ' +_chatParams.otherUserFirstName,
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
		height: 40,
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
		text: L('Send'), 
		top: 12,
		left: 256 + 13,
		color: '#a8c98e', 
		shadowColor: '#6ba333',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		zIndex:3
	});
	chatInputView.add(sendLabel);
	
	var chatInputTextField = Ti.UI.createTextArea({
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
		text: L('Message'), 
		top: 12,
		left: 24,
		color: '#ababab', 
		font:{fontSize:14},
		zIndex:4,
		
	});
	chatInputView.add(hintTextLabel);
		
	chatWindow.add(chatInputView);    	
	chatWindow.add(chatListView);

//	chatWindow.add(chatMessagesTableView);
	
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
		bottom: 216,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_inputView = Ti.UI.createAnimation({
		bottom: 0,
		duration: 350,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});

	chatInputTextField.addEventListener('focus', function() {
		//if(chatMessagesTableView.data[0] !== undefined && chatMessagesTableView.data[0].rowCount > 0)
		//	chatMessagesTableView.scrollToIndex(chatMessagesTableView.data[0].rowCount - 1);
		chatListView.scrollToItem(0, chatData.length - 1);

		hintTextLabel.visible = false;
		sendLabel.color = '#ffffff';
		
		//chatMessagesTableView.animate(animateNegativeUp_chatView);
		chatListView.animate(animateNegativeUp_chatView); 
		
		chatInputView.animate(animateUp_inputView);
		chatInputView.height = 60;
		chatInputTextField.height = 40;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		if(chatInputTextField.value === "") { 
			sendLabel.color = '#a8c98e';
			hintTextLabel.visible = true;
		}
		chatListView.animate(animateDown_chatView); 
		
		chatInputView.animate(animateDown_inputView);
		chatInputView.height = 40;
		chatInputTextField.height = 30;
	});
	
    chatSendButtonCenter.addEventListener('click', function() {
		if(chatInputTextField.value.trim() === "") {
			chatInputTextField.value = "";
			chatInputTextField.blur();
			return;
		}
		
		var numLines = Math.ceil(chatInputTextField.value.length / 28);
		var rowHeight = 40 + (numLines - 1) * 10;
										
		//add to list view
	    chatData.push({
			properties: {backgroundColor: '#ededed', height: rowHeight},
			userPic: { image: _chatParams.userImage},
			chatMessage: { text: chatInputTextField.value, color: '#818181'},
		});
		
		if(otherUserGuid === "") { //normal user has an empty guid
			send_a_message(chatInputTextField.value);
		} else {
			//add cartoon row
			var numLines = Math.ceil(cartoonMsgs[cartoonIndexMsg].length / 28);
			var rowHeight = 40 + (numLines - 1) * 10;
						
			chatData.push({
				properties: {backgroundColor: '#f6f6f6', height: rowHeight},
				userPic: { image: _chatParams.otherUserImage},
				chatMessage: { text: cartoonMsgs[cartoonIndexMsg]},
				time: Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss")
			});
			Ti.API.info("already push to chatData array (cartoon)");
			cartoonIndexMsg++;
			if(cartoonIndexMsg >= cartoonMsgs.length) 
				cartoonIndexMsg = 0;
		}
		listSection.items = chatData;
		
		chatInputTextField.value = "";
    	chatInputTextField.blur();
    	
    	//some time out to scroll down
    	setTimeout(function() {
			chatListView.scrollToItem(0, chatData.length - 1);
		}, 500);
    });
	
	profileButton.addEventListener('click', function() {
		//open previous match
		var previousMatchWindow = new MatchWindowModule(userObject.id, _chatParams.matchId);
		previousMatchWindow.setNavGroup(navGroup);
		navGroup.open(previousMatchWindow, {animated:true});
	});
	
	chatWindow.addEventListener('close', function(){
		//unsubscribe here...
		Ti.App.Flurry.endTimedEvent('chat-screen');
		Ti.API.info('unsubscribe from channel: '+currentChatRoom);
		pubnub.unsubscribe({ channel : currentChatRoom });
	});	
	
	subscribe_chat_room();
    return this;
};
