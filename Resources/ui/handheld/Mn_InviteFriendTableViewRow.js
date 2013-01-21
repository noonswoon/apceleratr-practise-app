InviteFriendTableViewRow = function(_user, _rowIndex) {
	var isInvited = true; 
	
	var tableRow = Ti.UI.createTableViewRow({
		height: 50,
		backgroundSelectedColor: '#fff',
		backgroundColor:'#fff'
	});

	var imageView = Ti.UI.createImageView({
		left: 10,
		width: 40,
		height: 40,
		touchEnabled: false
	});

	var userLabel = Ti.UI.createLabel({
		font: {fontSize:15, fontWeight:'bold'},
		left: 60,
		height: 20,
		width: 180,
		color: '#000'
	});
	
	var inviteButton = Titanium.UI.createButton({
		color:'grey',
		enabled: false,
		top:12,
		right: 10,
		width:60,
		height:25,
		font:{fontSize:14},
		title:'Invite'
	});
	
	var checkbox = Ti.UI.createButton({
	    title: '\u2713',
	    top: 40,
	    right: 10,
	    width: 15,
	    height: 15,
	    borderColor: '#666',
	    borderWidth: 2,
	    borderRadius: 3,
	    color: 'black',
	    font:{fontSize: 12, fontWeight: 'bold'},
	    value: true //value is a custom property in this casehere.
	});
 
	//Attach some simple on/off actions
	checkbox.on = function() {
	    this.title='\u2713';
	    this.value = true;
	};
	 
	checkbox.off = function() {
	    this.title='';
	    this.value = false;
	};	
	
	imageView.image = _user.picture_url;
	userLabel.text =  _user.name;
	tableRow.fbId = _user.facebook_id;
	
	tableRow.filter = userLabel.text;

	var  isInvited = false; 

/*
	if (_rowIndex > Ti.App.NUM_INVITE_ALL - 1) { //auto-select the first X people 
		isInvited = false;
		inviteButton.enabled = true;
	}
*/
	
	inviteButton.addEventListener("click", function() {
		if(inviteButton.enabled) {
			inviteButton.title = "Invited";
			inviteButton.enabled = false;
			isInvited = true;
			Ti.App.fireEvent('invitedFriend'); 
		}
	});
	
	Ti.App.addEventListener("inviteAllToggled", function(e) {
		inviteButton.title = "Invite";
		if(e.inviteAll && _rowIndex < Ti.App.NUM_INVITE_ALL) { //only enable the first x rows (upperLimit)
			inviteButton.enabled = false;
			isInvited = true;
		} else {
			inviteButton.enabled = true;
			isInvited = false;
		}
	});
	
	tableRow.isInvited = function() {
	    return isInvited;
	};
	
	tableRow.reset = function() {
		inviteButton.title = "Invite";
		inviteButton.enabled = true;
		isInvited = false;	
	}
	
	tableRow.add(imageView);
	tableRow.add(userLabel);
	tableRow.add(inviteButton);

	return tableRow;	
}
module.exports = InviteFriendTableViewRow;