Ct_ConnectionTableViewRow = function(_userId, _matchInfo){
	
	var row = Ti.UI.createTableViewRow({
		height: 45,
		backgroundColor: '#32394a'
	});
	
	var personNameLbl = Ti.UI.createLabel({
		text: _matchInfo.first_name,
		textAlign: 'left',
		color: '#c4ccda',
		left: 60,
		width: 142,
		top: 10,
		font:{fontWeight:'bold',fontSize:12},
	});
	row.add(personNameLbl);
	
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
	row.add(connectDateLbl);
	var personImage = Ti.UI.createImageView({
		image: _matchInfo.image,
		width:35,
		height:35,
		left:5
	});
	
	row.add(personImage);
	row.matchId = _matchInfo.match_id;
	row.profileId = _matchInfo.user_id;
	row.firstName = _matchInfo.first_name;
	
	row.addEventListener('click', function() {
		Ti.API.info('the row is clicked!');
	});
	return row;
}
module.exports = Ct_ConnectionTableViewRow;