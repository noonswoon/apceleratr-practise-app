AboutMeEditTableViewRow = function(_fieldName, _content) {
	var fieldName = _fieldName;
	var modified = false;
	
	var numChars = _content.length;
	var rowHeightOffset = Math.floor(numChars / 33);
	Ti.API.info('numChars: '+numChars+', rowHeightOffset: '+rowHeightOffset);
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 90 + rowHeightOffset * 21 ,
		backgroundImage: 'images/match-info-white-row.png',
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-profile-about.png'
	})
	tableRow.add(glyphImage);
	
	//127, 535
	var contentTextArea = Ti.UI.createTextArea({
		value: _content,
		color: '#697688',
		top: 8, 
		left: 64,
		font: {fontSize:16},
		height: 70 + rowHeightOffset * 21 ,
		width: 241,
	});
	tableRow.add(contentTextArea);
		
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentTextArea.value;
	};

	tableRow.setContent = function(_value) {
		contentTextArea.value = _value;
	};
	
	return tableRow;		
};

module.exports = AboutMeEditTableViewRow;