LeftMenuWindow = function(_userId) {
	
	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:260
	});

	var userInfoView = Ti.UI.createView({
		top: 0,
		left:0,
		width: 260,
		height: 44,
		backgroundColor: '#32394a'
	});
	
	var userPhoto = Ti.UI.createImageView({
		image: 'https://graph.facebook.com/202852/picture?type=square',
		backgroundColor: 'orange',
		left: 5,
		top: 5,
		width: 35, 
		height: 35
	});
		
	var userName = Ti.UI.createLabel({
		text: 'Kavin Asavanant',
		color: '#b9c1cf',
		left: 55,
		top: 10,
		font:{fontWeight:'bold',fontSize:16},
	});
	
	var userSettingIcon = Ti.UI.createImageView({
		image: 'images/icon/option.png',
		right: 10,
		top: 10,
		width: 25,
		height: 25
	});
	userInfoView.add(userPhoto);
	userInfoView.add(userName);
	userInfoView.add(userSettingIcon);
	
	userSettingIcon.addEventListener('click', function() {
		Ti.API.info('open the edit page info'); 
	});
	
	self.add(userInfoView);
		
	return self;
}
module.exports = LeftMenuWindow;