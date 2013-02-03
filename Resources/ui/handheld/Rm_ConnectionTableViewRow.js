ConnectionTableViewRow = function(_userId, _matchInfo){
	var self = Ti.UI.createTableViewRow({
		className: 'connectionRow',
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
	var personNameLbl = Ti.UI.createLabel({
		text: _matchInfo.first_name,
		left: 55,
		top: 12,
		color: '#cdd4df',
		font:{fontSize:16},
	});
	self.add(personNameLbl);
	
	var dm = Ti.App.moment(_matchInfo.connected_date, "YYYY-MM-DDTHH:mm:ss");
	var connectedStr = dm.format('DD/MM/YY');
	var connectDateLbl = Ti.UI.createLabel({
		text: 'Connected on ' + connectedStr,
		textAlign: 'left',
		color: '#a8b4cb',
		left: 60,
		top: 30,
		font:{fontSize:10},
	});
//	self.add(connectDateLbl);

	var personImage = Ti.UI.createImageView({
		image: _matchInfo.image,
		width:35,
		height:35,
		top: 4,
		left: 8,
		borderColor: '#111b33', 
		borderWidth: 1,
		borderRadius: 2
	});
	self.add(personImage);
	
	var leftArrow = Ti.UI.createImageView({
		image: 'images/menu-separator-arrow.png',
		left: 242,
		top: 15,
		width: 11,
		height: 15
	});
	self.add(leftArrow);
	
	self.matchId = _matchInfo.match_id;
	self.profileId = _matchInfo.user_id;
	self.firstName = _matchInfo.first_name;
	
	self.addEventListener('click', function() {
		Ti.API.info('the connection row is clicked!');
	});
	
	return self;
}
module.exports = ConnectionTableViewRow;