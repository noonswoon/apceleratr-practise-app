AboutMeTableViewRow = function(_fieldName, _content, _isWhiteBackground) {
	var fieldName = _fieldName;
	var modified = false;
	
	var numChars = _content.length;
	var rowHeightOffset = Math.floor(numChars / 33);

	var rowBackgroundImage = 'images/match-info-white-row.png';	
	if(!_isWhiteBackground) {
		rowBackgroundImage = 'images/match-info-gray-row.png';
	}
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 50 + rowHeightOffset * 21 ,
		backgroundImage: rowBackgroundImage,
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-about.png'
	})
	tableRow.add(glyphImage);
	
	//127, 535
	var contentLabel = Ti.UI.createLabel({
		text: _content,
		color: '#697688',
		top: 16, 
		left: 64,
		font: {fontSize:16},
		height: 'auto',
		width: 250
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

module.exports = AboutMeTableViewRow;