TopFriendsTableViewRow = function(_fbUser) {
	var FacebookSharing = require('internal_libs/facebookSharing');
	
	var self = Ti.UI.createTableViewRow({ //refactoring out (2)
		className: 'topFriendRow',
		height: 50,
		backgroundColor: '#32394a',
		fbId: _fbUser.facebook_id,		
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
	var rowTopBorder = Ti.UI.createView({
		top: 0, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#474d5c',
		zIndex: 1
	});
	
	var rowBottomBorder = Ti.UI.createView({
		top: 49, 
		width: '100%',
		height: 1,
		borderWidth: 1,
		borderColor: '#242a37',
		zIndex: 1
	});
	self.add(rowTopBorder);
	self.add(rowBottomBorder);
			
	var friendImage = Ti.UI.createImageView({
		image: _fbUser.picture_url,
		width: 40, 
		height: 40, 
		top: 5,
		left: 5
	}); 
	self.add(friendImage);		
	
	var friendName = Ti.UI.createLabel({
		text: _fbUser.name,
		left: 55,
		top: 15,
		color: '#cdd4df',
		font:{fontSize:16},
	});
	self.add(friendName);
			
	var inviteIcon = Ti.UI.createImageView({
		image: 'images/leftmenu/invite_friend_button.png',
		right: 10,
		top: 5,
		width: 50,
		height: 40
	});
	
	//double binding - changing the execution context
	inviteIcon.addEventListener('click', function() {
		if(Ti.App.ACTUAL_FB_INVITE) {
			FacebookSharing.sendRequestOnFacebook(_fbUser.facebook_id);	
		} else {
			Ti.App.fireEvent('inviteCompleted', {inviteeList:[_fbUser.facebook_id]});
		}
	});
	
	self.add(inviteIcon);
	
	return self;
}
module.exports = TopFriendsTableViewRow;