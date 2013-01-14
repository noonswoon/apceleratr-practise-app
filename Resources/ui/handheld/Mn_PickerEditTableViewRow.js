PickerEditTableViewRow = function(_fieldName, _category, _content, _parentWindow, _pickerData) {	
	var fieldName = _fieldName; 
	var modified = false;
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 40,
		backgroundColor:'#fff',
		className: 'textEditRow'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var categoryLabel = Ti.UI.createLabel({
		text: _category,
		top: 5, 
		left: 10,
		font: {fontSize: 14},
		backgroundColor: 'orange',
		height: 30
	});
	
	var contentTextfield = Titanium.UI.createTextField({
		value: _content,
		height:30,
		top:5,
		right:10,
		width:220,
		borderWidth:1,
		borderColor:'#bbb',
		borderRadius:5,
		paddingLeft: 10,
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

	//Opacity window when picker is shown
	var opacityView = Ti.UI.createView({
		opacity : 0.6,
		top : 0,
		height : 120,
		zIndex : 7777,
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
		
		var pickerLabel = Ti.UI.createLabel({
			text: curContent,
			width: 300,
			left: 5
		});
		row.add(pickerLabel);
		picker.add(row);
	}

	pickerView.add(toolbar);
	pickerView.add(picker);

	var slideInAnimation =  Titanium.UI.createAnimation({bottom:0});
	var slideOutAnimation =  Titanium.UI.createAnimation({bottom:-251});

	contentTextfield.addEventListener('focus',function() {
		tableRow.resetBorder();
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
		else contentTextfield.value = e.row.content;
	});

	_parentWindow.add(pickerView);

	tableRow.add(categoryLabel);
	tableRow.add(contentTextfield);
	
	return tableRow;		

};

module.exports = PickerEditTableViewRow;
