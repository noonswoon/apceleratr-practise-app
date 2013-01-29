FbLikeTableViewRow = function(_fieldName, fbLikeArray, _isWhiteBackground) {
	var GlyphGraphicsHelper = require('/internal_libs/glyphGraphicsHelper');
	
	var fieldName = _fieldName;
	var modified = false;

	var rowBackgroundImage = 'images/match-info-white-row.png';	
	if(!_isWhiteBackground) {
		rowBackgroundImage = 'images/match-info-gray-row.png';
	}
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 100,
		backgroundImage: rowBackgroundImage,
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph-likes.png'
	})
	tableRow.add(glyphImage);
	
	
	//likes-capsule-stretchable.png height: 25
	var createLikeCapsuleContent = function(_category, _content) {
		var glyphImageUrl = GlyphGraphicsHelper.getLikeGlyph(_category);

		var displayContent = _content;
		var viewWidth = 65 + 3* (displayContent.length - 4); //set up for 4 characters
		
//		if(displayContent.length > 8) {
//			displayContent = _content.substring(0,8) + '...';
//			viewWidth = 61 + 3 * 4; //3 points for each characters, maximum 8 characters 
//		}
		var glyphImageView = Ti.UI.createImageView({
			image: glyphImageUrl,
			center: {x:13, y:'50%'},
			height: 10,
			width: 10,
			zIndex: 3
		});
		
		var likeLabel = Ti.UI.createLabel({
			text: displayContent,
			center: {x:'60%', y:'50%'},
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
	
	var likeContent1 = createLikeCapsuleContent('Movie', 'True Blood');
	likeContent1.top = 18;
	likeContent1.left = 64;
	tableRow.add(likeContent1);
	
	var likeContent2 = createLikeCapsuleContent('Book', 'Wall Street Journal');
	likeContent2.top = 18;
	likeContent2.left = 64 + likeContent1.width + 10;
	tableRow.add(likeContent2);
		
	var likeContent3 = createLikeCapsuleContent('Travel/leisure', 'Roadtrip');
	likeContent3.top = 18;
	likeContent3.left =  64 + likeContent1.width + 10 + likeContent2.width + 10;
	tableRow.add(likeContent3);	

	
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