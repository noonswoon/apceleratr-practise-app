ChatMessageTableViewRow = function(_chatMessage, _chatOwner, _isASender) {
	
	/* TEST CASE
	 * [	"Nice to meet you! However, I am just a cartoon.", 
						"I would love to meet up with you if I am a person.",
						"Can you come to the cartoon world?"];
	 * 
	 */
	
	var numLines = Math.ceil(_chatMessage.length / 18);
	Ti.API.info('chatMessageLength: '+ _chatMessage.length +', numLines: '+ numLines);
	
	var self = Ti.UI.createTableViewRow({
		height: 30 + numLines * 15,
		borderColor: 'black', 
		borderWidth: 1,
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var userPic = Ti.UI.createImageView({
		image: _chatOwner.imageUrl,
		width: 35,
		height: 35,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#d5d5d5',
		bottom: 5,
	});

	var horizontalLength = _chatMessage.length * 8;
	if(horizontalLength > 188) 
		horizontalLength = 188; 
 
	var verticalLength = 1 + (numLines - 1) * 15; 
	
	if(_isASender) {
		//green bubble
		userPic.right = 7;
		var rightPosition = 49;
		var bubblePart1 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-1.png',
			top: 5,
			right: rightPosition + 20 + horizontalLength,
			width: 14, 
			height: 19,
		});
		self.add(bubblePart1);
		
		var bubblePart2 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-2.png',
			top: 5,
			right: rightPosition + 20,
			width: horizontalLength, 
			height: 19,
		});
		self.add(bubblePart2);
		
		var bubblePart3 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-3.png',
			top: 5,
			right: rightPosition,
			width: 20, 
			height: 19,
		});
		self.add(bubblePart3);
		
		var bubblePart4 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-4.png',
			top: 5 + 19,
			right: rightPosition + 20 + horizontalLength,
			width: 14, 
			height: verticalLength,
		});
		self.add(bubblePart4);
		
		var bubblePart5 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-5.png',
			top: 5 + 19,
			right: rightPosition + 20,
			width: horizontalLength, 
			height: verticalLength,
		});
		self.add(bubblePart5);
		
		var bubblePart6 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-6.png',
			top: 5 + 19,
			right: rightPosition,
			width: 20, 
			height: verticalLength,
		});
		self.add(bubblePart6);
		
		var bubblePart7 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-7.png',
			top: 5 + 19 + verticalLength,
			right: rightPosition + 20 + horizontalLength,
			width: 14, 
			height: 12,
		});
		self.add(bubblePart7);
		
		var bubblePart8 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-8.png',
			top: 5 + 19 + verticalLength,
			right: rightPosition + 20,
			width: horizontalLength, 
			height: 12,
		});
		self.add(bubblePart8);
	
		var bubblePart9 = Ti.UI.createImageView({
			image: 'images/chat/green-bubble-9.png',
			top: 5 + 19 + verticalLength,
			right: rightPosition,
			width: 20, 
			height: 12,
		});	
		self.add(bubblePart9);
		
		var chatMessageLabel = Ti.UI.createLabel({
			left: 320 - (rightPosition + 20 + horizontalLength + 14) + 8, //+5 is padding
			top: 10,
			textAlign: 'left',
			width: 210,
			text: _chatMessage,
			color: 'black',
			font: { fontSize: 14, fontFamily: 'Courier' }
		});
		self.add(chatMessageLabel);
	} else {
		//gray bubble
		userPic.left = 7;
		
		var leftPosition = 49;
		var bubblePart1 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-1.png',
			top: 5,
			left: leftPosition,
			width: 20, 
			height: 19,
		});
		self.add(bubblePart1);
		
		var bubblePart2 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-2.png',
			top: 5,
			left: leftPosition + 20,
			width: horizontalLength, 
			height: 19,
		});
		self.add(bubblePart2);
		
		var bubblePart3 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-3.png',
			top: 5,
			left: leftPosition + 20 + horizontalLength,
			width: 14, 
			height: 19,
		});
		self.add(bubblePart3);
		
		var bubblePart4 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-4.png',
			top: 5 + 19,
			left: leftPosition,
			width: 20, 
			height: verticalLength,
		});
		self.add(bubblePart4);
		
		var bubblePart5 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-5.png',
			top: 5 + 19,
			left: leftPosition + 20,
			width: horizontalLength, 
			height: verticalLength,
		});
		self.add(bubblePart5);
		
		var bubblePart6 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-6.png',
			top: 5 + 19,
			left: leftPosition + 20 + horizontalLength,
			width: 14, 
			height: verticalLength,
		});
		self.add(bubblePart6);
		
		var bubblePart7 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-7.png',
			top: 5 + 19 + verticalLength,
			left: leftPosition,
			width: 20, 
			height: 12,
		});
		self.add(bubblePart7);
		
		var bubblePart8 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-8.png',
			top: 5 + 19 + verticalLength,
			left: leftPosition + 20,
			width: horizontalLength, 
			height: 12,
		});
		self.add(bubblePart8);
	
		var bubblePart9 = Ti.UI.createImageView({
			image: 'images/chat/gray-bubble-9.png',
			top: 5 + 19 + verticalLength,
			left: leftPosition + 20 + horizontalLength,
			width: 14, 
			height: 12,
		});	
		self.add(bubblePart9);
		
		var chatMessageLabel = Ti.UI.createLabel({
			left: leftPosition + 12, //+5 is padding
			top: 10,
			textAlign: 'left',
			width: 210,
			text: _chatMessage,
			color: 'black',
			font: { fontSize: 14, fontFamily: 'Courier' }
		});
		self.add(chatMessageLabel);
	}
	
	self.add(userPic);	
	return self;
}
module.exports = ChatMessageTableViewRow;
