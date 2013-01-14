LeftMenuWindow = function(_userId) {
	var CreditViewModule = require('ui/handheld/Lm_CreditView');
	
	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:260
	});

	var editProfileView = Ti.UI.createView({
		top: 0,
		left:0,
		width: 260,
		height: 44,
		backgroundColor: '#2c3342'
	});

	var editProfileIcon = Ti.UI.createImageView({
		image: 'images/icon/option.png',
		left: 10,
		top: 10,
		width: 25,
		height: 25
	});
			
	var editProfileLbl = Ti.UI.createLabel({
		text: 'Edit profile',
		color: '#b9c1cf',
		left: 55,
		top: 10,
		font:{fontWeight:'bold',fontSize:16},
	});
	
	var creditView = new CreditViewModule(40); 

	editProfileView.add(editProfileIcon);
	editProfileView.add(editProfileLbl);
	editProfileView.add(creditView);
	
	editProfileIcon.addEventListener('click', function() {
		Ti.API.info('open the edit page info -- src: btn'); 
		Ti.App.fireEvent('openEditProfileWindow');
	});
	
	editProfileLbl.addEventListener('click', function() {
		Ti.API.info('open the edit page info -- src: lbl');
		Ti.App.fireEvent('openEditProfileWindow');
	});
	
	self.add(editProfileView);
		
	return self;
}
module.exports = LeftMenuWindow;