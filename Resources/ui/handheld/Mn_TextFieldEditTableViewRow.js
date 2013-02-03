TextFieldEditTableViewRow = function(_fieldName, _content) {
	var GlyphGraphicsHelper = require('internal_libs/glyphGraphicsHelper');
	var DefaultTextHelper = require('internal_libs/defaultTextHelper');
	
	var fieldName = _fieldName; 
	var modified = false;
	
	var content = _content;
	var textColor = "#4e5866";
	if(_content === "") {
		textColor =  "#a3a7ad";
		content = DefaultTextHelper.getDefaultText(_fieldName);
	}
	
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 48,
		backgroundImage: 'images/match-info-white-row.png',
		className: 'editProfileRow'
	});
	
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var contentTextfield = Titanium.UI.createTextField({
		value: content,
		top: 18, 
		left: 64,
		width: 241,
		height: 20,
		color:textColor,
		font:{fontWeight:'bold',fontSize:18},
	});
	tableRow.add(contentTextfield);
	
	var topicGlyphImage = GlyphGraphicsHelper.getTopicGlyph(_fieldName, _content, false);
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: topicGlyphImage
	})
	tableRow.add(glyphImage);	
	
	contentTextfield.addEventListener('focus', function() {
		modified = true;
		if(contentTextfield.value === DefaultTextHelper.getDefaultText(_fieldName)) {
			contentTextfield.value = "";
			contentTextfield.color = "#4e5866";
		}
		Ti.API.info('contentTextfield modified...');
	});
	
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentTextfield.value;
	};
	
	tableRow.getModified = function() {
		return modified;
	};
		
	tableRow.highlightBorder = function() {
		contentTextfield.borderWidth = 1;
		contentTextfield.borderColor = 'red';
	};
	
	tableRow.resetBorder = function() {
		contentTextfield.borderWidth = 0;
	};	

	return tableRow;		

};

module.exports = TextFieldEditTableViewRow;
