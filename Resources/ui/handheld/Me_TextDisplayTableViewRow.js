//TODO: change to label rather than textfield
TextDisplayTableViewRow = function(_fieldName, _category, _content) {
	var fieldName = _fieldName; 
	var modified = false;
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 35,
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
		height: 20
	});
	
	var contentLabel = Ti.UI.createLabel({
		text: _content,
		top:5,
		right: 10,
		height:20,
		width:220,
		font: {fontSize: 14},
		backgroundColor: 'orange'
	});
	
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentLabel.text;
	};

	tableRow.setContent = function(_value) {
		contentLabel.text = _value;
	};
	
	tableRow.add(categoryLabel);
	tableRow.add(contentLabel);
	
	return tableRow;		
};

module.exports = TextDisplayTableViewRow;