PickerEditTableViewRow = function(_fieldName, _content, _parentWindow, _pickerData) {	
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

	//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 166,
		zIndex : 10,
		backgroundColor: '#000'
	});

	//Picker
	var pickerView = Titanium.UI.createView({
		height:251,
		bottom:-251,
		zIndex: 2
	});

	var done =  Titanium.UI.createButton({
		title:'Done',
		style:Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	var spacer =  Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar =  Titanium.UI.iOS.createToolbar({
		top:0,
		zIndex: 3,
		items:[done]
	});

	var picker = Titanium.UI.createPicker({
		top:43
	});
	picker.selectionIndicator = true;
	

	for(var i = 0; i < _pickerData.length; i++) {
		var curContent = _pickerData[i];
		var row = Ti.UI.createPickerRow({
			width:100,
			heigth:100,
			content: curContent
		});
		
		var pickerGlyphImage = GlyphGraphicsHelper.getTopicGlyph(_fieldName, curContent, false);
	
		var pickerGlyphImageView = Ti.UI.createImageView({
			left: 5, 
			width: 34,
			height: 34,
			image: pickerGlyphImage
		})
		row.add(pickerGlyphImageView);
		
			
		var pickerLabel = Ti.UI.createLabel({
			text: curContent,
			width: 300,
			left: 45
		});
		row.add(pickerLabel);
		picker.add(row);
	}

	pickerView.add(toolbar);
	pickerView.add(picker);

	var slideInAnimation =  Titanium.UI.createAnimation({bottom:0});
	var slideOutAnimation =  Titanium.UI.createAnimation({bottom:-251});

	contentTextfield.addEventListener('focus',function() {
		contentTextfield.blur();
		modified = true;
		pickerView.animate(slideInAnimation);
		_parentWindow.add(opacityView);
	});

	done.addEventListener('click',function() {
		pickerView.animate(slideOutAnimation);
		_parentWindow.remove(opacityView);
	});
	
	picker.addEventListener('change',function(e) {
		if(e.rowIndex === 0)
			contentTextfield.value = '';
		else {
			contentTextfield.value = e.row.content;
			var newGlyphImage = GlyphGraphicsHelper.getTopicGlyph(_fieldName, e.row.content, false);
			glyphImage.image = newGlyphImage;
		}
	});

	_parentWindow.add(pickerView);

	tableRow.add(contentTextfield);
	
	return tableRow;
};

module.exports = PickerEditTableViewRow;
