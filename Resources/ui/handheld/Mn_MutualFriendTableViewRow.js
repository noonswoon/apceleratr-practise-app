InviteFriendTableViewRow = function(_user, _rowIndex) {
	var isInvited = false; 
	
	var self = Ti.UI.createTableViewRow({
		height: 50,
		backgroundColor:'#eeeeee'
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var imageView = Ti.UI.createImageView({
		left: 6,
		width: 35,
		height: 35,
		touchEnabled: false,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#d5d5d5'
	});

	var userLabel = Ti.UI.createLabel({
		font: {fontSize:15, fontWeight:'bold'},
		left: 50,
		top: 15,
		color: '#919191'
	});
	
	var checkbox = Titanium.UI.createImageView({
		image: 'images/invite_friend/unchecked.png',
		top:7,
		left: 275,
		width:29,
		height:30
	});
	
	imageView.image = _user.picture_url;
	userLabel.text =  _user.name;
	self.fbId = _user.facebook_id;
	
	self.filter = userLabel.text;
	
	checkbox.addEventListener("click", function() {
		if(!isInvited) {
			checkbox.image = 'images/invite_friend/checked.png';
			userLabel.color = '#595959';
			isInvited = true;
			Ti.App.fireEvent('invitedFriend'); 
		} else {
			checkbox.image = 'images/invite_friend/unchecked.png';
			userLabel.color = '#919191';
			isInvited = false;
			Ti.App.fireEvent('uninvitedFriend'); 
		}
	});
	
	self.isInvited = function() {
	    return isInvited;
	};
	
	self.add(imageView);
	self.add(userLabel);
	self.add(checkbox);

	return self;	
}
module.exports = InviteFriendTableViewRow;