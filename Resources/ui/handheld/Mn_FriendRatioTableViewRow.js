//TODO: change all these to be just a label
FriendRatioTableViewRow = function(_fieldName, _content) {
	var fieldName = _fieldName; 
	
	var numFemaleFriends = 0;
	var numMaleFriends = 0;
	
	if(_content['female'] !== "")
		numFemaleFriends = parseInt(_content['female']);
	
	if(_content['male'] !== "")
		numMaleFriends = parseInt(_content['male']);

	var totalFriends = numFemaleFriends + numMaleFriends; 
	
	var femaleFriendPercent = 50;  //default
	var maleFriendPercent = 100 - femaleFriendPercent; 
	
	if(numFemaleFriends + numMaleFriends > 0) {
		femaleFriendPercent = Math.ceil( (numFemaleFriends * 100) / (numFemaleFriends + numMaleFriends));
		if(femaleFriendPercent < 1) femaleFriendPercent = 1; 
		maleFriendPercent = 100 - femaleFriendPercent; 
	}
	
	var femaleBarLength = Math.ceil(0.7 * femaleFriendPercent);
	var maleBarLength = Math.ceil(0.7 * maleFriendPercent); 
	
	var scaleFactor = 1; 
	if(femaleBarLength >= maleBarLength) {
		scaleFactor = 52 / femaleBarLength; 
	} else {
		scaleFactor = 52 / maleBarLength;
	}
	if(scaleFactor < 1) scaleFactor = 1;

	femaleBarLength = femaleBarLength * scaleFactor; 
	maleBarLength = maleBarLength * scaleFactor;
	
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

	var numFriendsFontSize = 27; 
	if(totalFriends > 1000)
		numFriendsFontSize = 24;
	
	var numberOfFriends = Ti.UI.createLabel({
		text: totalFriends,
		center: {x:'50%', y:'45%'},
		color: '#6d6d6d', 
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:2},
		font: {fontSize: numFriendsFontSize, fontWeight: 'bold'},
	});
	tableRow.add(numberOfFriends);

	var friendsLbl = Ti.UI.createLabel({
		text: L('FRIENDS'),
		left: 138,
		top: 53,
		color: '#a0a0a0', 
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:2},
		font: {fontSize: 10, fontWeight: 'bold'},
	});
	tableRow.add(friendsLbl);
	
	var femaleBar = Ti.UI.createImageView({
		image: 'images/friend-ratio-female-bar-stretch.png',
		width: femaleBarLength,
		height: 26,
		left: (127 - femaleBarLength), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 37,
	});
	var femaleBarEdge = Ti.UI.createImageView({
		image: 'images/friend-ratio-female-bar.png',
		width: 3,
		height: 26,
		left: (127 - femaleBarLength - 3), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 37,
	});
	tableRow.add(femaleBar);
	tableRow.add(femaleBarEdge);

	var femaleIcon = Ti.UI.createImageView({
		image: 'images/friend-ratio-female.png',
		top: 42,
		left: (127 - femaleBarLength - 11 - 5),
		width:11,
		height: 14,
	});
	tableRow.add(femaleIcon);
	
	var femalePercent = Ti.UI.createLabel({
		text: femaleFriendPercent + '%',
		left: (127 - femaleBarLength - 11 - 5 - 31), //starting point is 126..need to offset to the left by minus the lenght of the bar
		top: 40,
		color: '#f8989f',
		font: {fontSize: 14, fontWeight: 'bold'},
	});
	tableRow.add(femalePercent);
	
	var maleBar = Ti.UI.createImageView({
		image: 'images/friend-ratio-male-bar-stretch.png',
		width: maleBarLength,
		height: 26,
		left: 194,
		top: 37
	});
	var maleBarEdge = Ti.UI.createImageView({
		image: 'images/friend-ratio-male-bar.png',
		width: 3,
		height: 26,
		left: 194 + maleBarLength,
		top: 37
	});
	tableRow.add(maleBar);
	tableRow.add(maleBarEdge);
	
	var malePercent = Ti.UI.createLabel({
		text: maleFriendPercent + '%',
		left: (194 + maleBarLength + 5 + 11 + 2),  //(194 + maleBarLength + 5) => position of icon, +11 width of icon, + 5 spacing
		top: 40,
		color: '#53bfe8',
		font: {fontSize: 14, fontWeight: 'bold'},
	});
	tableRow.add(malePercent);
		
	var maleIcon = Ti.UI.createImageView({
		image: 'images/friend-ratio-male.png',
		width:11,
		height: 14,
		top: 43,
		left: (194 + maleBarLength + 5),
	});
	tableRow.add(maleIcon);

	return tableRow;		

};

module.exports = FriendRatioTableViewRow;
