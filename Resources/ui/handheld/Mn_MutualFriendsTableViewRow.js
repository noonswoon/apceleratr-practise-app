//TODO: change all these to be just a label
MutualFriendsTableViewRow = function(_fieldName, _content) {
	var fieldName = _fieldName; 

	var tableRow = Ti.UI.createTableViewRow({
		width: 320,
		height: 74,
		backgroundImage: 'images/mutual-friends.png'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	tableRow.getFieldName = function() {
		return fieldName;
	};

	return tableRow;
};

module.exports = MutualFriendsTableViewRow;
