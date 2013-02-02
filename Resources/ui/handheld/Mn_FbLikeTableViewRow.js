FbLikeTableViewRow = function(_fieldName, _fbLikeArray, _isWhiteBackground) {
	var GlyphGraphicsHelper = require('/internal_libs/glyphGraphicsHelper');
	
	var fieldName = _fieldName;
	var modified = false;

	var createLikeCapsuleContent = function(_category, _content) {
		var glyphImageUrl = GlyphGraphicsHelper.getLikeGlyph(_category);

		var displayContent = _content;
		var viewWidth = 65 + 4 * (displayContent.length - 4); //set up for 4 characters

		var glyphImageView = Ti.UI.createImageView({
			image: glyphImageUrl,
			center: {x:15, y:'50%'},
			height: 10,
			width: 10,
			zIndex: 3
		});
		
		var likeLabel = Ti.UI.createLabel({
			text: displayContent,
			center: {x:'61%', y:'50%'},
			font:{fontWeight:'bold',fontSize:10},
			color: '#4e5866', 
			zIndex: 2,
		});
		
		var capsuleView = Ti.UI.createView({
			backgroundImage: 'images/likes-capsule-stretchable.png',
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
	var capsuleEndPoint = 64;
	var capsuleStartPoint = 64;
	var nextStartPoint = 64;
	var likeContentArray = []; 
	
	for(var i = 0; i < _fbLikeArray.length; i++) {
		var curLikeStr = _fbLikeArray[i].name; 
		
		var likeContent = createLikeCapsuleContent(_fbLikeArray[i].category, curLikeStr);
		likeContent.top = 18 + (numRows - 1) * 35;
		likeContent.left = capsuleStartPoint;

		var curCapsuleWidth = 65 + 4 * (curLikeStr.length - 4); 
		var capsuleEndPoint = capsuleStartPoint + curCapsuleWidth;
		nextStartPoint = capsuleEndPoint + 10;
		if(nextStartPoint > 310 || capsuleEndPoint > 310) {
			numRows++; 
			capsuleStartPoint = 64; 
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
		height: 100 + (numRows - 2) * 25,
		backgroundImage: 'images/match-bottom-box.png',
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-likes.png'
	})
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