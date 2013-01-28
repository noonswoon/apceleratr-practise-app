//TODO: change to label rather than textfield
TextDisplayTableViewRow = function(_fieldName, _content, _isWhiteBackground) {
	var GlyphGraphicsHelper = require('internal_libs/glyphGraphicsHelper');
	
	var fieldName = _fieldName;
	var modified = false;
	
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
		
		
	var topicGlyphImage = GlyphGraphicsHelper.getTopicGlyph(_fieldName, _content);
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: topicGlyphImage
	})
	tableRow.add(glyphImage);

	var textColor = '#4e5866';  //b4b7bc
	if(_fieldName === 'name') 
		textColor = '#b4b7bc';
		
	var contentLabel = Ti.UI.createLabel({
		text: _content,
		color: textColor,
		top: 18, 
		left: 64,
		font: {fontSize: 14},
		height: 20
	});
	tableRow.add(contentLabel);
		
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

module.exports = TextDisplayTableViewRow;