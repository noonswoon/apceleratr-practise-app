TopFriendsTableViewRow = function(_fbUser) {
	var FacebookSharing = require('internal_libs/facebookSharing');
	
	var self = Ti.UI.createTableViewRow({ //refactoring out (2)
		height: 50,
		backgroundColor: '#32394a',
		fbId: _fbUser.facebook_id,		
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var friendImage = Ti.UI.createImageView({
		image: _fbUser.picture_url,
		width: 40, 
		height: 40, 
		top: 5,
		left: 5
	}); 
			
	var friendName = Ti.UI.createLabel({
		text: _fbUser.name,
		left: 55,
		top: 25,
		color: '#cdd4df',
		font:{fontWeight:'bold',fontSize:16},
	});
			
	var inviteIcon = Ti.UI.createImageView({
		image: 'images/leftmenu/invite_friend_button.png',
		right: 10,
		top: 5,
		width: 50,
		height: 40
	});
	
	//double binding - changing the execution context
	inviteIcon.addEventListener('click', function() {
		//FacebookSharing.sendRequestOnFacebook(_fbUser.facebook_id);	
		Ti.App.fireEvent('inviteCompleted', {inviteeList:[_fbUser.facebook_id]});
	});
			
	self.add(friendImage);
	self.add(friendName);
	self.add(inviteIcon);
	
	return self;
}
module.exports = TopFriendsTableViewRow;