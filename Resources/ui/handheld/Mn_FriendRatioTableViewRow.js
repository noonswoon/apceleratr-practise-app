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

	var femaleBarLength = 40;
	var maleBarLength = 65; 
	
	var femaleBar = Ti.UI.createImageView({
		image: 'images/friend-ratio-female-bar-stretch.png',
		width: femaleBarLength,
		height: 25,
		left: (126 - femaleBarLength), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 37,
	});
	var femaleBarEdge = Ti.UI.createImageView({
		image: 'images/friend-ratio-female-bar.png',
		width: 1,
		height: 25,
		left: (126 - femaleBarLength -1), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 37,
	});
	tableRow.add(femaleBar);
	tableRow.add(femaleBarEdge);

	
	var femalePercent = Ti.UI.createLabel({
		text: '25%',
		left: (126 - femaleBarLength - 32), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 42,
		color: '#fa7dcf',
		font: {fontSize: 16, fontWeight: 'bold'},
	});
	tableRow.add(femalePercent);

	var femaleIcon = Ti.UI.createImageView({
		image: 'images/friend-ratio-female.png',
		top: 44,
		left: (126 - femaleBarLength - 28 - 14),
		width:11,
		height: 14,
	});
	tableRow.add(femaleIcon);
	
	var maleBar = Ti.UI.createImageView({
		image: 'images/friend-ratio-male-bar-stretch.png',
		width: maleBarLength,
		height: 25,
		left: 194,
		top: 37
	});
	var maleBarEdge = Ti.UI.createImageView({
		image: 'images/friend-ratio-male-bar.png',
		width: 1,
		height: 25,
		left: 195,
		top: 37
	});
	tableRow.add(maleBar);
	tableRow.add(maleBarEdge);
	
	var malePercent = Ti.UI.createLabel({
		text: '75%',
		left: (194 + maleBarLength + 5),
		top: 42,
		color: '#6cbdf0',
		font: {fontSize: 16, fontWeight: 'bold'},
	});
	tableRow.add(malePercent);
		
	var maleIcon = Ti.UI.createImageView({
		image: 'images/friend-ratio-male.png',
		width:11,
		height: 14,
		top: 44,
		left: (194 + maleBarLength + 32),
	});
	tableRow.add(maleIcon);

	return tableRow;		

};

module.exports = FriendRatioTableViewRow;
