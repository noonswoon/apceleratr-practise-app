TextFieldEditTableViewRow = function(_fieldName, _category, _content) {
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
		paddingLeft: 10
	});
	
	contentTextfield.addEventListener('focus', function() {
		tableRow.resetBorder();
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
	tableRow.add(categoryLabel);
	tableRow.add(contentTextfield);
	
	return tableRow;		

};

module.exports = TextFieldEditTableViewRow;
