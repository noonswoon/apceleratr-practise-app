//TODO: change to label rather than textfield
TextDisplayTableViewRow = function(_fieldName, _content, _isWhiteBackground) {
	var GlyphGraphicsHelper = require('internal_libs/glyphGraphicsHelper');
	
	var fieldName = _fieldName;

	var rowClassName = 'matchInfoWhiteRow';
	var rowBackgroundImage = 'images/match-info-white-row.png';
	
	if(!_isWhiteBackground) {
		rowClassName = 'matchInfoGrayRow';
		rowBackgroundImage = 'images/match-info-gray-row.png';
	}
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 48,
		backgroundImage: rowBackgroundImage,
		className: rowClassName
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
	var topicGlyphImage = GlyphGraphicsHelper.getTopicGlyph(_fieldName, _content, true);
	
	var glyphImage = Ti.UI.createImageView({
		top: 8,
		left: 22, 
		width: 34,
		height: 34,
		image: topicGlyphImage
	});
	tableRow.add(glyphImage);

	var textColor = '#4e5866';  //b4b7bc
	if(_fieldName === 'name') 
		textColor = '#b4b7bc';
	
	var content = _content;
	var additionalContent = '';
	if(_fieldName === 'location') {
		content = _content['city'];
		additionalContent = _content['country'];
	}
	
	var contentLabel = Ti.UI.createLabel({
		text: L(content),
		color: textColor,
		top: 15, 
		left: 64,
		width: 241,
		height: 20,
		font:{fontWeight:'bold',fontSize:18},
	});
	tableRow.add(contentLabel);
	
	if(_fieldName === 'location') {
		var numChars = content.length;
		var additionalContentLabel = Ti.UI.createLabel({
			text: additionalContent,
			color: '#a3a7ad',
			top: 15, 
			left: 64 + (numChars * 10) + 10,
			width: 241 - ((numChars * 10) + 10),
			height: 20,
			font:{fontWeight:'bold',fontSize:18},
		});
		tableRow.add(additionalContentLabel);
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
	
	tableRow.getContentLabel = function() {
		return contentLabel;
	}
	
	return tableRow;		
};

module.exports = TextDisplayTableViewRow;