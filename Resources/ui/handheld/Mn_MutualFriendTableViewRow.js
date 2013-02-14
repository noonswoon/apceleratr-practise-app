//this is the row in the mutual friends screen
MutualFriendTableViewRow = function(_fbId) {
	var ModelFacebookFriend = require('model/facebookFriend');
	
	var self = Ti.UI.createTableViewRow({
		height: 50,
		backgroundColor:'#eeeeee'
	});
	if(Ti.Platform.osname === 'iphone')
		self.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var imageView = Ti.UI.createImageView({
		image: 'http://graph.facebook.com/'+ _fbId +'/picture?type=square',
		left: 6,
		width: 35,
		height: 35,
		touchEnabled: false,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#d5d5d5'
	});
	self.add(imageView);
	
	var userName = ModelFacebookFriend.getNameByFacebookId(_fbId); 
	if(userName !== "") {
		var userLabel = Ti.UI.createLabel({
			text: ModelFacebookFriend.getNameByFacebookId(_fbId),
			font: {fontSize:15, fontWeight:'bold'},
			left: 50,
			top: 15,
			color: '#595959'
		});
		self.add(userLabel);
	} else { //don't have data..request from fbGraph
		Ti.API.info('getting fb graph info coz cannot find user locally');
		Ti.Facebook.requestWithGraphPath(_fbId, {}, 'GET', function(e) {
			if (e.success) {
			    var fbGraphObj = JSON.parse(e.result);  //convert json text to javascript object	
			  	var userName = fbGraphObj.first_name + ' ' + fbGraphObj.last_name;
			    var userLabel = Ti.UI.createLabel({
					text: userName,
					font: {fontSize:15, fontWeight:'bold'},
					left: 50,
					top: 15,
					color: '#595959'
				});
				self.add(userLabel);
				
				//do the update to the local database
				//Ti.API.info('fbGraphObj: '+ JSON.stringify(fbGraphObj));
				var userLocation = "";
				Ti.API.info('fbGraphObject.location: '+ fbGraphObj.location)
				if(fbGraphObj.location !== undefined && fbGraphObj.location.name !== null) {
					userLocation = 	fbGraphObj.location.name;
				}
				ModelFacebookFriend.updateFacebookFriendName(_fbId, userName, 'http://graph.facebook.com/'+ _fbId +'/picture?type=square', userLocation); 
			} else if (e.error) {
				Ti.API.info('cannot request GraphPath: '+ JSON.stringify(e));		
			} else {
				Ti.API.info("what the hell is going on_2? " + JSON.stringify(e));
			}
		});
	}
	
	return self;	
}
module.exports = MutualFriendTableViewRow;