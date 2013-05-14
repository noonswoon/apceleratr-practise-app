TopFriendsTableViewRow = function(_fbUser) {
	var FacebookSharing = require('internal_libs/facebookSharing');
	
	var inviteeName = _fbUser.name; 
	if(inviteeName.length > 18) 
		inviteeName = inviteeName.substring(0,17)+'...';
		
	var self = Ti.UI.createTableViewRow({ //refactoring out (2)
		className: 'topFriendRow',
		height: 45,
		backgroundImage: 'images/menu-row-item.png',
		fbId: _fbUser.facebook_id,		
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var friendImage = Ti.UI.createImageView({
		image: _fbUser.picture_url,
		width: 35, 
		height: 35, 
		top: 4,
		left: 8,
		borderColor: '#111b33', 
		borderWidth: 1,
		borderRadius: 2
	}); 
	self.add(friendImage);		
	
	var friendName = Ti.UI.createLabel({
		text: inviteeName,
		left: 55,
		top: 12,
		color: '#cdd4df',
		font:{fontSize:16},
	});
	self.add(friendName);
			
	var inviteIcon = Ti.UI.createImageView({
		image: 'images/menu-invite-button.png',
		left: 218,
		top: 9,
		width: 37,
		height: 28
	});
	
	inviteIcon.addEventListener('click', function() {
		//Ti.App.Flurry.logEvent('left-menu-single-invite');
		if(Ti.App.ACTUAL_FB_INVITE) {
			FacebookSharing.sendRequestOnFacebook(_fbUser.facebook_id);	
		} else {
			Ti.App.fireEvent('inviteCompleted', {inviteeList:[_fbUser.facebook_id], trackingCode:'FROM_SIMULATOR'});
		}
	});
	
	self.add(inviteIcon);
	
	return self;
}
module.exports = TopFriendsTableViewRow;