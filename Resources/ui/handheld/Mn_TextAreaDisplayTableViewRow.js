//TODO: change all these to be just a label
TextAreaDisplayTableViewRow = function(_fieldName, _category, _content) {
	var fieldName = _fieldName; 
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		backgroundColor:'#fff',
		className: 'textAreaDisplayRow'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
	var categoryLabel = Ti.UI.createLabel({
		text: _category,
		top: 0, 
		left: 10,
		font: {fontSize: 14},
		height: 20
	});

	var textAreaWidth = 220; 
	if(_category === '') {
		textAreaWidth = 280;
	}
	
	var contentTextArea = Ti.UI.createLabel({
		text:_content,
		top:5,
		right:10,
		font: {fontSize:14},
		backgroundColor: 'green',
		height:40,
		width:textAreaWidth,
	});
	
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentTextArea.text;
	};
	
	tableRow.setContent = function(_value) {
		contentTextArea.text = _value;
	};
			
	tableRow.add(categoryLabel);
	tableRow.add(contentTextArea);
	
	return tableRow;		

};

module.exports = TextAreaDisplayTableViewRow;
