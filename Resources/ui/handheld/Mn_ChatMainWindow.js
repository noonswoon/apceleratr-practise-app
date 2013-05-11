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
	var MatchWindowModule = require('ui/handheld/Mn_MatchWindow');	
	var StrWidthHelper = require('internal_libs/strWidthHelper');
	
	var currentChatRoom = _chatParams['chat-room']; //POPULATE on line 304
	
	var userObject = {id: _chatParams.userId, imageUrl: _chatParams.userImage}; //real data --> {id: _chatParams.userId,imageUrl: ''};
	var otherUserGuid =  _chatParams.otherUserGuid;
	var otherUserObject = {id: _chatParams.otherUserId, imageUrl: _chatParams.otherUserImage}; //{id: _chatParams.otherUserId,imageUrl: ''};
	var navGroup = _chatParams.navGroup;
	var cartoonMsgs = [	L("Hi!"),
						L("Nice to meet you! However, I am just a cartoon."), 
						L("I would love to meet up with you if I were a real person."),
						L("Can you come to the cartoon world?")];
	var cartoonIndexMsg = 0;
	
	var listViewHeight = 376; //480 - 20 (status bar) - 44 (nav bar) - 40 (input view)
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		listViewHeight = 464; // 568 - 57 = 511
	}

	var sideOffset = 49; 
	var horizontalLength = 188;  
	var verticalLength = 1;
	var isInputTextFieldFocus = false;

	var chatTemplate = {
		properties: {
			selectionStyle: Ti.UI.iPhone.ListViewCellSelectionStyle.NONE,
		},
		childTemplates: [
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'userPic', 
				properties: {
					bottom: 5,
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
					textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
					center: {y:'50%'},
					width: 200,
					color: 'black',
					font: {fontSize: 14, fontFamily: 'Helvetica Neue'},
					zIndex: 2
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart1', 
				properties: {
					top: 5,
					height: 19, 
					touchEnabled: false, 
					zIndex: 1
				}
			}, 
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart2', 
				properties: {
					top: 5,
					height: 19, 
					touchEnabled: false, 
					zIndex: 1
				}
			}, 
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart3', 
				properties: {
					top: 5,
					height: 19, 
					touchEnabled: false, 
					zIndex: 1
				}
			}, 
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart4', 
				properties: {
					top: 5 + 19,
					touchEnabled: false, 
					zIndex: 1
				}
			}, 
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart5', 
				properties: {
					top: 5 + 19,
					touchEnabled: false, 
					zIndex: 1
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart6', 
				properties: {
					top: 5 + 19,
					touchEnabled: false, 
					zIndex: 1
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart7', 
				properties: {
					height: 12, 
					touchEnabled: false, 
					zIndex: 1
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart8', 
				properties: {
					height: 12, 
					touchEnabled: false, 
					zIndex: 1
				}
			},
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'bubblePart9', 
				properties: {
					height: 12, 
					touchEnabled: false, 
					zIndex: 1
				}
			},
		]
	};

	var chatListView = Ti.UI.createListView({
		top: 0, 
		backgroundColor: '#e0e0e0',
		height: listViewHeight,
		templates: {'chatTemplate': chatTemplate},
		defaultItemTemplate: 'chatTemplate',
	});
	
	var listSection = null;
	
	var chatData = []; 
	 // ----------------------------------
    // LISTEN FOR MESSAGES
    // ----------------------------------
    var compareChatHistory = function(a, b) {
    	if(a.time < b.time) return -1; //เวลาน้อยกว่า (เกิดก่อน) มาก่อนใน array
    	if(a.time > b.time) return 1; 
    	return 0;
    };
       
    var computeChatLayoutNumbers = function(str) {
    	var chatLayoutNumbers = {};
    	
    	var strWidth = StrWidthHelper.computeStrWidth(str);		
    											
		var numLines = Math.ceil(strWidth / 210); 	//compute by counting character
		var horizontalLength = strWidth - 8;
		if(horizontalLength > 188) horizontalLength = 188;
		else if(horizontalLength < 0) horizontalLength = 0;
		var newVerticalLength = 1 + (numLines - 1) * 19;
		var rowHeight = 40 + (numLines - 1) * 20;
		
		chatLayoutNumbers.numLines = numLines;
		chatLayoutNumbers.horizontalLength = horizontalLength; 
		chatLayoutNumbers.newVerticalLength = newVerticalLength; 
		chatLayoutNumbers.rowHeight = rowHeight; 
		
		//Ti.API.info('str: '+str+', strWidth: '+strWidth+', numLines: '+numLines);
		return chatLayoutNumbers;
    };
    
    var subscribe_chat_room = function() {
		//clear data
		if(otherUserGuid === "") { //normal user has an empty guid, only subscribe if normal user
			pubnub.subscribe({
		        channel  : currentChatRoom,
		        connect  : function() {
		            Ti.API.info("connecting...");
		        },
		        callback : function(message) {
		        	//since pubnub is a broadcaster, sender will receive his own message as well
		        	//prevent from having the user sees his own message when it got broadcasted
		        	if(userObject.id !== message.senderId) {
						Ti.Media.vibrate(); //i love things that shake!
		           		var receivedMessage = message.text.trim();
						var chatLayoutNumbers = computeChatLayoutNumbers(receivedMessage);
						chatData.push({
							properties: {backgroundColor: '#e0e0e0', height: chatLayoutNumbers.rowHeight}, //#f6f6f6
							userPic: { image: _chatParams.otherUserImage, left: 7},
							chatMessage: { text: receivedMessage,  width: 200, left: sideOffset + 12},
							time: message.time, 
							bubblePart1: {image: 'images/chat/gray-bubble-1.png', left: sideOffset, width: 20}, 
							bubblePart2: {image: 'images/chat/gray-bubble-2.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength},									
							bubblePart3: {image: 'images/chat/gray-bubble-3.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14},
							bubblePart4: {image: 'images/chat/gray-bubble-4.png', left: sideOffset, width: 20, height: chatLayoutNumbers.newVerticalLength},	
							bubblePart5: {image: 'images/chat/gray-bubble-5.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, height: chatLayoutNumbers.newVerticalLength},
							bubblePart6: {image: 'images/chat/gray-bubble-6.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, height: chatLayoutNumbers.newVerticalLength},
							bubblePart7: {image: 'images/chat/gray-bubble-7.png', left: sideOffset, width: 20, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},	
							bubblePart8: {image: 'images/chat/gray-bubble-8.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
							bubblePart9: {image: 'images/chat/gray-bubble-9.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},										
						});	
						
						//save to local db -- not saving..trade-off between complexity and speed (pick less complexity and less speed)
/*						var messageObj = {};
						messageObj.matchId = _chatParams.matchId;
						messageObj.message = receivedMessage; 
						messageObj.userId = userObject.id;
						messageObj.targetedUserId = otherUserObject.id; 
						messageObj.senderId = otherUserObject.id;
						messageObj.receiverId = userObject.id; 
						messageObj.time = message.time;
						ModelChatHistory.insertChatMessage(messageObj);	
						
* */
						
						if(listSection === null) {
							listSection = Ti.UI.createListSection({items: chatData});
							chatListView.sections = [listSection];
						} else {
							listSection.items = chatData;
						}
						
						if(chatData.length > 1) {
							setTimeout(function() {
								chatListView.scrollToItem(0, chatData.length - 1, {animated: false});
							}, 500);
						}
					}
		        },
		        error : function() {
		       		Ti.API.info("Lost connection...");
		        }
		    });
		} else {
			//cartoon stuff
			var cartoonLayoutNumbers = computeChatLayoutNumbers(cartoonMsgs[cartoonIndexMsg]);
			chatData.push({
				properties: {backgroundColor: '#e0e0e0', height: cartoonLayoutNumbers.rowHeight}, //#f6f6f6
				userPic: { image: _chatParams.otherUserImage, left: 7},
				chatMessage: { text: cartoonMsgs[cartoonIndexMsg],  width: 200, left: sideOffset + 12},
				time: Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"),
				bubblePart1: {image: 'images/chat/gray-bubble-1.png', left: sideOffset, width: 20}, 
				bubblePart2: {image: 'images/chat/gray-bubble-2.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength},									
				bubblePart3: {image: 'images/chat/gray-bubble-3.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14},
				bubblePart4: {image: 'images/chat/gray-bubble-4.png', left: sideOffset, width: 20, height: cartoonLayoutNumbers.newVerticalLength},	
				bubblePart5: {image: 'images/chat/gray-bubble-5.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength, height: cartoonLayoutNumbers.newVerticalLength},
				bubblePart6: {image: 'images/chat/gray-bubble-6.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14, height: cartoonLayoutNumbers.newVerticalLength},
				bubblePart7: {image: 'images/chat/gray-bubble-7.png', left: sideOffset, width: 20, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},	
				bubblePart8: {image: 'images/chat/gray-bubble-8.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},
				bubblePart9: {image: 'images/chat/gray-bubble-9.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},										
			});							
			cartoonIndexMsg++;
			if(cartoonIndexMsg >= cartoonMsgs.length) 
				cartoonIndexMsg = 0;

			listSection = Ti.UI.createListSection({items: chatData});
			chatListView.sections = [listSection];
		}
    };
    
     // ----------------------------------
    // SEND MESSAGE
    // ----------------------------------
    var send_a_message = function(message) {
        if (!message) return;

		pubnub.publish({
			channel  : currentChatRoom,
			message  : { text : message, senderId: userObject.id, time: Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss")},
			callback : function(info) {
				if (!info[0]) setTimeout(function() {
					send_a_message(message)
				}, 5000 );
			}
		});
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
		backgroundColor: '#e0e0e0',
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
	
	this.chatWindow = chatWindow;
    this.pubnub      = pubnub;
    
    //animate up
	var animateUp_inputView = Ti.UI.createAnimation({
		bottom: 216,
		duration: 200,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	var animateDown_inputView = Ti.UI.createAnimation({
		bottom: 0,
		duration: 200,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
	});
	
	chatInputTextField.addEventListener('focus', function() {
		setTimeout(function() {
			chatListView.scrollToItem(0, chatData.length - 1, {animated: true});
		}, 100);
		
		hintTextLabel.visible = false;
		sendLabel.color = '#ffffff';
		
		//if need to animate the listView up
		chatListView.height = (listViewHeight - 236);
		chatInputView.animate(animateUp_inputView);
		chatInputView.height = 60;
		chatInputTextField.height = 40;
		
		isInputTextFieldFocus = true;
	});
	
	chatInputTextField.addEventListener('blur', function() {
		if(chatInputTextField.value === "") { 
			sendLabel.color = '#a8c98e';
			hintTextLabel.visible = true;
		}
			
		chatListView.height = listViewHeight;
		chatInputView.animate(animateDown_inputView);
		chatInputView.height = 40;
		chatInputTextField.height = 30;
		isInputTextFieldFocus = false;
	});
	
	chatListView.addEventListener('itemclick', function(e) {
		if(isInputTextFieldFocus) {
			chatInputTextField.blur();
		}
	});
	
    chatSendButtonCenter.addEventListener('click', function() {
		if(chatInputTextField.value.trim() === "") {
			chatInputTextField.value = "";
			return;
		}
		
		var sendingMessage = chatInputTextField.value.trim();
		var chatLayoutNumbers = computeChatLayoutNumbers(sendingMessage);
		chatData.push({
			properties: {backgroundColor: '#e0e0e0', height: chatLayoutNumbers.rowHeight}, //#ededed
			userPic: { image: _chatParams.userImage, right: 7},
			chatMessage: { text: sendingMessage, width: 200, left: 320 - (sideOffset + 20 + chatLayoutNumbers.horizontalLength + 14) + 8 }, //+5 is padding
			time: Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"),
			bubblePart1: {image: 'images/chat/green-bubble-1.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14}, 
			bubblePart2: {image: 'images/chat/green-bubble-2.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength},
			bubblePart3: {image: 'images/chat/green-bubble-3.png', right: sideOffset, width: 20},
			bubblePart4: {image: 'images/chat/green-bubble-4.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, height: chatLayoutNumbers.newVerticalLength},
			bubblePart5: {image: 'images/chat/green-bubble-5.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, height: chatLayoutNumbers.newVerticalLength},
			bubblePart6: {image: 'images/chat/green-bubble-6.png', right: sideOffset, width: 20, height: chatLayoutNumbers.newVerticalLength},
			bubblePart7: {image: 'images/chat/green-bubble-7.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
			bubblePart8: {image: 'images/chat/green-bubble-8.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
			bubblePart9: {image: 'images/chat/green-bubble-9.png', right: sideOffset, width: 20, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
		});	
		
		if(otherUserGuid === "") { //normal user has an empty guid
			if(sendingMessage !== "") {
				var messageObj = {}; 
				messageObj.matchId = _chatParams.matchId;
				messageObj.message = sendingMessage; 
				messageObj.userId = userObject.id;
				messageObj.targetedUserId = otherUserObject.id; 
				messageObj.senderId = userObject.id;
				messageObj.receiverId = otherUserObject.id; 
				messageObj.time = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss");
								
				//save to local db
				ModelChatHistory.insertChatMessage(messageObj);	
				
				//send to backend server
				BackendChat.saveChatMessage(messageObj, function(_sentData) {});
				BackendChat.sendNotification(messageObj, function(e) {
					if(e.success) Ti.API.info('send push notif successfully');
				});
				send_a_message(sendingMessage);				
			}

		} else {
			//add cartoon row			
			var cartoonLayoutNumbers = computeChatLayoutNumbers(cartoonMsgs[cartoonIndexMsg]);
			chatData.push({
				properties: {backgroundColor: '#e0e0e0', height: cartoonLayoutNumbers.rowHeight}, //#f6f6f6
				userPic: { image: _chatParams.otherUserImage, left: 7},
				chatMessage: { text: cartoonMsgs[cartoonIndexMsg],  width: 200, left: sideOffset + 12},
				time: Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"),
				bubblePart1: {image: 'images/chat/gray-bubble-1.png', left: sideOffset, width: 20}, 
				bubblePart2: {image: 'images/chat/gray-bubble-2.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength},									
				bubblePart3: {image: 'images/chat/gray-bubble-3.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14},
				bubblePart4: {image: 'images/chat/gray-bubble-4.png', left: sideOffset, width: 20, height: cartoonLayoutNumbers.newVerticalLength},	
				bubblePart5: {image: 'images/chat/gray-bubble-5.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength, height: cartoonLayoutNumbers.newVerticalLength},
				bubblePart6: {image: 'images/chat/gray-bubble-6.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14, height: cartoonLayoutNumbers.newVerticalLength},
				bubblePart7: {image: 'images/chat/gray-bubble-7.png', left: sideOffset, width: 20, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},	
				bubblePart8: {image: 'images/chat/gray-bubble-8.png', left: sideOffset + 20, width: cartoonLayoutNumbers.horizontalLength, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},
				bubblePart9: {image: 'images/chat/gray-bubble-9.png', left: sideOffset + 20 + cartoonLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + cartoonLayoutNumbers.newVerticalLength},										
			});							
			cartoonIndexMsg++;
			if(cartoonIndexMsg >= cartoonMsgs.length) 
				cartoonIndexMsg = 0;
		}
				
		if(listSection === null) {
			listSection = Ti.UI.createListSection({items: chatData});
			chatListView.sections = [listSection];
		} else {
			listSection.items = chatData;
		}
		
		chatInputTextField.value = "";
    	
    	//some time out to scroll down
    	setTimeout(function() {
			chatListView.scrollToItem(0, chatData.length - 1, {animated: true});
		}, 300);
    });
	
	profileButton.addEventListener('click', function() {
		//open previous match
		var previousMatchWindow = new MatchWindowModule(userObject.id, _chatParams.matchId);
		previousMatchWindow.setNavGroup(navGroup);
		navGroup.open(previousMatchWindow, {animated:true});
	});
	
	
	var chatMsgDataReadyCallback = function() {
		var chatRawData = ModelChatHistory.getChatHistory(_chatParams.matchId);
		for(var i = 0; i < chatRawData.length; i++) {
			var curMsg = chatRawData[i].message;
			var chatLayoutNumbers = computeChatLayoutNumbers(curMsg);
			if(userObject.id === chatRawData[i].senderId) {
				chatData.push({
					properties: {backgroundColor: '#e0e0e0', height: chatLayoutNumbers.rowHeight}, //#ededed
					userPic: { image: _chatParams.userImage, right: 7},
					chatMessage: { text: curMsg, width: 200, left: 320 - (sideOffset + 20 + chatLayoutNumbers.horizontalLength + 14) + 8 }, //+5 is padding
					time: chatRawData[i].time,
					bubblePart1: {image: 'images/chat/green-bubble-1.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14}, 
					bubblePart2: {image: 'images/chat/green-bubble-2.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength},
					bubblePart3: {image: 'images/chat/green-bubble-3.png', right: sideOffset, width: 20},
					bubblePart4: {image: 'images/chat/green-bubble-4.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, height: chatLayoutNumbers.newVerticalLength},
					bubblePart5: {image: 'images/chat/green-bubble-5.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, height: chatLayoutNumbers.newVerticalLength},
					bubblePart6: {image: 'images/chat/green-bubble-6.png', right: sideOffset, width: 20, height: chatLayoutNumbers.newVerticalLength},
					bubblePart7: {image: 'images/chat/green-bubble-7.png', right: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
					bubblePart8: {image: 'images/chat/green-bubble-8.png', right: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
					bubblePart9: {image: 'images/chat/green-bubble-9.png', right: sideOffset, width: 20, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
				});	
			} else {
				chatData.push({
					properties: {backgroundColor: '#e0e0e0', height: chatLayoutNumbers.rowHeight}, //#f6f6f6
					userPic: { image: _chatParams.otherUserImage, left: 7},
					chatMessage: { text: curMsg, width: 200, left: sideOffset + 12},
					time: chatRawData[i].time,
					bubblePart1: {image: 'images/chat/gray-bubble-1.png', left: sideOffset, width: 20}, 
					bubblePart2: {image: 'images/chat/gray-bubble-2.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength},									
					bubblePart3: {image: 'images/chat/gray-bubble-3.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14},
					bubblePart4: {image: 'images/chat/gray-bubble-4.png', left: sideOffset, width: 20, height: chatLayoutNumbers.newVerticalLength},	
					bubblePart5: {image: 'images/chat/gray-bubble-5.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, height: chatLayoutNumbers.newVerticalLength},
					bubblePart6: {image: 'images/chat/gray-bubble-6.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, height: chatLayoutNumbers.newVerticalLength},
					bubblePart7: {image: 'images/chat/gray-bubble-7.png', left: sideOffset, width: 20, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},	
					bubblePart8: {image: 'images/chat/gray-bubble-8.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
					bubblePart9: {image: 'images/chat/gray-bubble-9.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},										
				});	
			}		
		}
		if(chatData.length > 0) {
			chatData.sort(compareChatHistory);
			listSection = Ti.UI.createListSection({items: chatData});
			chatListView.sections = [listSection];
			chatListView.scrollToItem(0, chatData.length - 1, {animated: false});
		}		
	};
	Ti.App.addEventListener('chatMsgDataReady', chatMsgDataReadyCallback);
		
	chatWindow.addEventListener('close', function(){
		//unsubscribe here...
		Ti.App.removeEventListener('chatMsgDataReady', chatMsgDataReadyCallback);
		pubnub.unsubscribe({ channel : currentChatRoom });
	});	
	
	
	//either pull from the local db or from server	
	if(otherUserGuid === "" &&  !Ti.App.Properties.hasProperty(currentChatRoom)) {
		Ti.App.Properties.setInt(currentChatRoom, 1); //so never fetch again
		BackendChat.getAllChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId}, function(_chatHistory) {
			var chatHistoryMsgs = _chatHistory.content.chat_messages;
			for(var i = 0; i < chatHistoryMsgs.length; i++) {
				
				var chatMessageObj = {};
				chatMessageObj.matchId = _chatParams.matchId;

				chatMessageObj.userId = userObject.id;
				chatMessageObj.targetedUserId = otherUserObject.id; 
				chatMessageObj.message = chatHistoryMsgs[i].message.trim();
				chatMessageObj.time = chatHistoryMsgs[i].time;
				
				if(userObject.id === chatHistoryMsgs[i].sender_id) {
					chatMessageObj.senderId = userObject.id;
					chatMessageObj.receiverId = otherUserObject.id;
				} else {
					chatMessageObj.senderId = otherUserObject.id;
					chatMessageObj.receiverId = userObject.id;
				}
				
				//compute and insert into local db
				ModelChatHistory.insertChatMessage(chatMessageObj);	
			}
			Ti.App.fireEvent('chatMsgDataReady');
		});
	} else {
		//pull just the unread msg
		BackendChat.getUnreadChatHistory({matchId:_chatParams.matchId, userId: _chatParams.userId}, function(_chatHistory) {
			var chatUnreadMsgs = _chatHistory.content.chat_messages;
			var hasNewUnread = false;
			for(var i = 0; i < chatUnreadMsgs.length; i++) {
				var chatMessageObj = {};
				chatMessageObj.matchId = _chatParams.matchId;
				chatMessageObj.userId = userObject.id;
				chatMessageObj.targetedUserId = otherUserObject.id; 
				chatMessageObj.message = chatUnreadMsgs[i].message.trim();
				chatMessageObj.time = chatUnreadMsgs[i].time;
				chatMessageObj.senderId = chatUnreadMsgs[i].sender_id;
				chatMessageObj.receiverId = chatUnreadMsgs[i].receiver_id;
				//insert to db
				ModelChatHistory.insertChatMessage(chatMessageObj);	
				
				//building the UI
				var curMsg =  chatUnreadMsgs[i].message.trim();
				var chatLayoutNumbers = computeChatLayoutNumbers(curMsg);
				chatData.push({
					properties: {backgroundColor: '#e0e0e0', height: chatLayoutNumbers.rowHeight}, //#f6f6f6
					userPic: { image: _chatParams.otherUserImage, left: 7},
					chatMessage: { text: curMsg, width: 200, left: sideOffset + 12},
					time: chatUnreadMsgs[i].time,
					bubblePart1: {image: 'images/chat/gray-bubble-1.png', left: sideOffset, width: 20}, 
					bubblePart2: {image: 'images/chat/gray-bubble-2.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength},									
					bubblePart3: {image: 'images/chat/gray-bubble-3.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14},
					bubblePart4: {image: 'images/chat/gray-bubble-4.png', left: sideOffset, width: 20, height: chatLayoutNumbers.newVerticalLength},	
					bubblePart5: {image: 'images/chat/gray-bubble-5.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, height: chatLayoutNumbers.newVerticalLength},
					bubblePart6: {image: 'images/chat/gray-bubble-6.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, height: chatLayoutNumbers.newVerticalLength},
					bubblePart7: {image: 'images/chat/gray-bubble-7.png', left: sideOffset, width: 20, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},	
					bubblePart8: {image: 'images/chat/gray-bubble-8.png', left: sideOffset + 20, width: chatLayoutNumbers.horizontalLength, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},
					bubblePart9: {image: 'images/chat/gray-bubble-9.png', left: sideOffset + 20 + chatLayoutNumbers.horizontalLength, width: 14, top: 5 + 19 + chatLayoutNumbers.newVerticalLength},										
				});
				hasNewUnread = true;
			}
			if(hasNewUnread && chatData.length > 0) {
				chatData.sort(compareChatHistory);
				listSection = Ti.UI.createListSection({items: chatData});
				chatListView.sections = [listSection];
				chatListView.scrollToItem(0, chatData.length - 1, {animated: false});
			}		
		});
		Ti.App.fireEvent('chatMsgDataReady');
	}
	subscribe_chat_room();
    return this;
};