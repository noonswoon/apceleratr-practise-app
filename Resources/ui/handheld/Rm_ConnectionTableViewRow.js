ConnectionTableViewRow = function(_userId, _matchInfo){
	var self = Ti.UI.createTableViewRow({
		className: 'connectionRow',
		height: 45,
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var backgroundImageView = Ti.UI.createView({
		backgroundImage: 'images/menu-row-item.png',
		height: 45, 
		zIndex: 1
	});
	self.add(backgroundImageView)
	
	var personNameLbl = Ti.UI.createLabel({
		text: _matchInfo.first_name,
		left: 55,
		top: 12,
		color: '#cdd4df',
		font:{fontSize:16},
		zIndex: 2
	});
	self.add(personNameLbl);
	
/*
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
	self.add(connectDateLbl);
*/
	var personImage = Ti.UI.createImageView({
		image: _matchInfo.image,
		width:35,
		height:35,
		top: 4,
		left: 8,
		borderColor: '#111b33', 
		borderWidth: 1,
		borderRadius: 2,
		zIndex: 2
	});
	self.add(personImage);
	
	var numNewMessages = 0;
	var showNotif = false;
	if(_matchInfo.number_unread_messages !== "")
		numNewMessages = _matchInfo.number_unread_messages;
	
	var notifViewWidth = 15;
	if(numNewMessages < 10) 
		notifViewWidth = 15; 
	else if(numNewMessages < 100)
		notifViewWidth = 22; 
	else notifViewWidth = 29;
	
	var notifNumber = null;
	var notifView = null;
	if(numNewMessages > 0) {
		showNotif = true;
		notifNumber = Ti.UI.createLabel({
			text: numNewMessages,
			center: {x:'50%', y:'48%'},
			color: '#ffff',
			shadowColor: '#3e830d', 
			shadowOffset: {x:0, y:2},
			font:{fontWeight:'bold', fontSize:14},
			zIndex: 4
		});
		
		notifView = Ti.UI.createImageView({
			backgroundImage: 'images/rightmenu-notification.png', 
			backgroundLeftCap: 3, 
			right: 24,
			top: 12,
			height: 21, 
			width: notifViewWidth,
			zIndex: 1,
			zIndex: 3
		});	
		notifView.add(notifNumber);
		self.add(notifView);
	}
		
	var leftArrow = Ti.UI.createImageView({
		image: 'images/menu-separator-arrow.png',
		left: 242,
		top: 15, 
		width: 11,
		height: 15,
		zIndex: 2
	});
	self.add(leftArrow);
	
	self.matchId = _matchInfo.match_id;
	self.profileId = _matchInfo.user_id;
	self.guid = _matchInfo.guid;
	self.firstName = _matchInfo.first_name;
	self.profileImage = _matchInfo.image;
	
	self.addEventListener('touchstart', function() {
		backgroundImageView.backgroundImage = 'images/menu-row-item-active.png';
		if(showNotif) {
			notifView.visible = false;
			showNotif = false;
		}
	});
	
	self.addEventListener('touchend', function() {
		backgroundImageView.backgroundImage = 'images/menu-row-item.png';
	});
	
	return self;
}
module.exports = ConnectionTableViewRow;