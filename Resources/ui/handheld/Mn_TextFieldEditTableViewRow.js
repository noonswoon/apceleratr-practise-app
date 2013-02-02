TextFieldEditTableViewRow = function(_fieldName, _content) {
	var GlyphGraphicsHelper = require('internal_libs/glyphGraphicsHelper');
	
	var fieldName = _fieldName; 
	var modified = false;
	
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
		value: _content,
		top: 18, 
		left: 64,
		width: 241,
		height: 20,
		color:'#a3a7ad',
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
		contentTextfield.borderColor = 'red';
	};
	
	tableRow.resetBorder = function() {
		contentTextfield.borderColor = '#bbb';
	};	

	return tableRow;		

};

module.exports = TextFieldEditTableViewRow;
