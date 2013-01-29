WorkTableViewRow = function(_fieldName, _employer, _occupation, _isWhiteBackground) {
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
		height: 55,
		backgroundImage: rowBackgroundImage,
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph-work.png'
	})
	tableRow.add(glyphImage);
	
	//127, 535
	var employerLabel = Ti.UI.createLabel({
		text: _employer,
		color: '#4e5866',
		top: 10, 
		left: 64,
		font:{fontWeight:'bold',fontSize:14},
	});
	tableRow.add(employerLabel);
	
	//1917-->2037 // 120 --> 60
	var fadedLinkImage = Ti.UI.createImageView({
		top: 30,
		left: 38,
		width: 3,
		height: 24, 
		image: 'images/glyph-secondary-link-faded.png'
		
	});
//	tableRow.add(fadedLinkImage);
	
	var secondaryGlyphImage = Ti.UI.createImageView({
		top: 45,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph-secondary-work.png'
	})
//	tableRow.add(secondaryGlyphImage);
	
	var occupationLabel = Ti.UI.createLabel({
		text: _occupation,
		color: '#4e5866',
		top: 30, 
		left: 64,
		font:{fontSize:14},
	});
	tableRow.add(occupationLabel);	
		
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

module.exports = WorkTableViewRow;