AboutMeEditTableViewRow = function(_content) {
	var DefaultTextHelper = require('internal_libs/defaultTextHelper');
	
	var fieldName = 'about_me';
	var modified = false;
	
	var content = _content;
	var textColor = "#697688";
	if(_content === "") {
		textColor =  "#a3a7ad";
		content = DefaultTextHelper.getDefaultText(fieldName);
	}
	
	var numChars = _content.length;
	var rowHeightOffset = Math.floor(numChars / 33);
	Ti.API.info('numChars: '+numChars+', rowHeightOffset: '+rowHeightOffset);
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 90 + rowHeightOffset * 21 ,
		backgroundImage: 'images/match-bottom-box.png',
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
		value: content,
		color: textColor,
		top: 8, 
		left: 64,
		font: {fontSize:16},
		height: 70 + rowHeightOffset * 21 ,
		width: 241,
	});
	tableRow.add(contentTextArea);
	
	contentTextArea.addEventListener('focus', function() {
		modified = true;
		if(contentTextArea.value === DefaultTextHelper.getDefaultText(fieldName)) {
			contentTextArea.value = "";
			contentTextArea.color = "#697688";
		}
		Ti.API.info('contentTextArea modified...');
	});
		
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getModified = function() {
		return modified;
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