TextAreaEditTableViewRow = function(_fieldName, _category, _content) {
	var fieldName = _fieldName; 
	var modified = false;
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 80,
		backgroundColor:'#fff',
		className: 'textAreaEditRow'
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

	var textAreaWidth = 220; 
	if(_category === '') {
		textAreaWidth = 280;
	}
		
	var contentTextArea = Ti.UI.createTextArea({
		font: {fontSize:14},
		value:_content,
		height:60,
		width:textAreaWidth,
		top:5,
		right:10,
		borderWidth:1,
		borderColor:'#bbb',
		borderRadius:5,
		paddingLeft: 10
	});

	contentTextArea.addEventListener('focus', function() {
		tableRow.resetBorder();
		modified = true;
	});
	
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentTextArea.value;
	};
		
	tableRow.getModified = function() {
		return modified;
	};
	
	tableRow.highlightBorder = function() {
		contentTextArea.borderColor = 'red';
	};
	
	tableRow.resetBorder = function() {
		contentTextArea.borderColor = '#bbb';
	};	
		
	tableRow.add(categoryLabel);
	tableRow.add(contentTextArea);
	
	return tableRow;		

};

module.exports = TextAreaEditTableViewRow;
