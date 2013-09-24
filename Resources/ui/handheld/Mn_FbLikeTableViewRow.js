FbLikeTableViewRow = function(_fieldName, _fbLikeArray, _isWhiteBackground) {
	var GlyphGraphicsHelper = require('/internal_libs/glyphGraphicsHelper');
	var StrWidthHelper = require('internal_libs/strWidthHelper');
	
	var fieldName = _fieldName;
	var modified = false;

	var calculateCapsuleWidth = function(strWidth) {
		//need to scale down a bit
		
		var widthForCapsuleText = Math.ceil(strWidth/2);
		return 65 + widthForCapsuleText; //4 * (strLen - 4); //set up for 4 characters, +15 for padding
	};
	
	var createLikeCapsuleContent = function(_category, _content, _isMutual) {
		var contentColor = '#4e5866';
		if(_isMutual) {
			contentColor = '#e01124';
		}
		var glyphImageUrl = GlyphGraphicsHelper.getLikeGlyph(_category);

		var displayContent = _content;
		var strWidth = StrWidthHelper.computeStrWidth(displayContent);	
		var viewWidth =  calculateCapsuleWidth(strWidth);

		var glyphImageView = Ti.UI.createImageView({
			image: glyphImageUrl,
			left: 10, 
			top: 7,
			height: 10,
			width: 10,
			zIndex: 3
		});
		
		var likeLabel = Ti.UI.createLabel({
			text: displayContent,
			left: 25, 
			top: 5,
			font:{fontWeight:'bold',fontSize:10},
			color: contentColor, 
			zIndex: 2,
		});
		
		var capsuleView = Ti.UI.createView({
			backgroundImage: 'images/likes-capsule-stretchable.png',
			//backgroundColor: 'yellow',
			height: 25,
			width: viewWidth,
			zIndex: 1,
			backgroundLeftCap: 11
		});

		capsuleView.add(glyphImageView);
		capsuleView.add(likeLabel);
		return capsuleView;
	};
	//calculate how many rows of like do we need out of 5 contents -- cut off on the right side is when left + width > 310
	//calculating number of rows needed
	var numRows = 1;

	var capsuleStartPoint = 64;
	var capsuleEndPoint = 64;
	var nextStartPoint = 64;
	var likeContentArray = []; 
	
	var firstLikeOfRow = true;
	
	for(var i = 0; i < _fbLikeArray.length; i++) {
		var curLikeStr = _fbLikeArray[i].name; 
		var isMutualLike = _fbLikeArray[i].is_mutual;
		var likeContent = createLikeCapsuleContent(_fbLikeArray[i].category, curLikeStr, isMutualLike);
		likeContent.top = 18 + (numRows - 1) * 35;
		likeContent.left = capsuleStartPoint;
		
		var strWidth = StrWidthHelper.computeStrWidth(curLikeStr);	
		var curCapsuleWidth = calculateCapsuleWidth(strWidth);
		var capsuleEndPoint = capsuleStartPoint + curCapsuleWidth;
		nextStartPoint = capsuleEndPoint + 10;
		if(nextStartPoint > 310 || capsuleEndPoint > 310) {
			numRows++; 
			capsuleStartPoint = 25; //from 2nd row onwards, move the first Like to a bit to the left
			capsuleEndPoint = capsuleStartPoint + curCapsuleWidth;
			
			likeContent.top = 18 + (numRows - 1) * 35;
			likeContent.left = capsuleStartPoint;
			nextStartPoint = capsuleEndPoint + 10;
		}
		capsuleStartPoint = nextStartPoint;
		likeContentArray.push(likeContent);
	}

	if(numRows < 2) numRows = 2;
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 100 + (numRows - 2) * 35,
		backgroundImage: 'images/match-bottom-box.png',
	});

	Ti.API.info('numRows: '+numRows + ' , height: '+ (100 + (numRows - 2) * 35));


	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-likes.png'
	});
	tableRow.add(glyphImage);
	
	
	//likes-capsule-stretchable.png height: 25
/*	
	var likeContent1 = createLikeCapsuleContent('Movie', 'True Blood');
	likeContent1.top = 18;
	likeContent1.left = 64;
	tableRow.add(likeContent1);
	
	var likeContent2 = createLikeCapsuleContent('Sports league', 'NBA');
	likeContent2.top = 18;
	likeContent2.left = 64 + likeContent1.width + 10;
	tableRow.add(likeContent2);
		
	var likeContent3 = createLikeCapsuleContent('Travel/leisure', 'Roadtrip');
	likeContent3.top = 18;
	likeContent3.left =  64 + likeContent1.width + 10 + likeContent2.width + 10;
	tableRow.add(likeContent3);	
	Ti.API.info('likeContent3.left: '+likeContent3.left);
	
	var likeContent4 = createLikeCapsuleContent('Musician/band', 'The Beatles');
	likeContent4.top = 43 + 10;
	likeContent4.left = 64;
	tableRow.add(likeContent4);
	
	var likeContent5 = createLikeCapsuleContent('City', 'Bangkok');
	likeContent5.top = 43 + 10;
	likeContent5.left = 64 + likeContent4.width + 10;
	tableRow.add(likeContent5);
		
	var likeContent6 = createLikeCapsuleContent('Entertainer', 'Mr. Bean');
	likeContent6.top = 43 + 10;
	likeContent6.left =  64 + likeContent4.width + 10 + likeContent5.width + 10;
	tableRow.add(likeContent6);
*/

	for(var i = 0; i < likeContentArray.length; i++) {
		tableRow.add(likeContentArray[i]);
	}
	
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentLabel.text;
	};

	tableRow.setContent = function(_value) {
		contentLabel.text = _value;
	};
	
	return tableRow;		
};

module.exports = FbLikeTableViewRow;