//TODO: change all these to be just a label
FriendRatioTableViewRow = function(_fieldName, _content) {
	var fieldName = _fieldName; 
	
	var tableRow = Ti.UI.createTableViewRow({
		width: 320,
		height: 93,
		backgroundImage: 'images/friend-ratio.png'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	tableRow.getFieldName = function() {
		return fieldName;
	};

	var numberOfFriends = Ti.UI.createLabel({
		text: 808,
		center: {x:'50%', y:'45%'},
		color: '#6d6d6d', 
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:2},
		font: {fontSize: 27, fontWeight: 'bold'},
	});
	tableRow.add(numberOfFriends);

	var friendsLbl = Ti.UI.createLabel({
		text: 'FRIENDS',
		left: 138,
		top: 53,
		color: '#a0a0a0', 
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:2},
		font: {fontSize: 10, fontWeight: 'bold'},
	});
	tableRow.add(friendsLbl);

	
	return tableRow;		

};

module.exports = FriendRatioTableViewRow;
