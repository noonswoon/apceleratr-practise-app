CampaignWindow = function(_navGroup, _userId) {
	Ti.App.GATracker.trackScreen("CampaignWindow");
	
	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: L('Campaign'),
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});

	var campaignImageUrl = 'https://noonswoon.com/campaign.png'; 
	if(iphone5Flag) {
		campaignImageUrl = 'https://noonswoon.com/campaign-568.png'; 
	}
	
	var promotionalImage = Ti.UI.createImageView({
		image: campaignImageUrl,
		height: '100%',
		width: '100%'
	});
	self.add(promotionalImage);
	
	return self;
};

module.exports = CampaignWindow;

