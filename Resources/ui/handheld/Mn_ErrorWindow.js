ErrorWindow = function(_userId) {
	
	Ti.App.Flurry.logEvent('error-screen');
	
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee'
	});

	var imageView = Ti.UI.createImageView({
		image: 'images/error/message-error.png',
		width: 162, 
		height: 153,
		center: {x:'50%', y:'30%'}
	});
	self.add(imageView); 
					
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: L('A problem occurred'),
		center: {x:'50%', y:'50%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('Retry'),
		center: {x:'56%', y:'63%'}, //x:88
		color: '#919191',
		font:{fontWeight:'bold',fontSize:18},
	});
	self.add(description1Lbl);

	var retryImage = Ti.UI.createImageView({
		image: 'images/error/error-retry.png',
		width: 16, 
		height: 15,
		center: {x:'44%', y:'63%'}, //x:88
	});
	self.add(retryImage);

	var contactBtn = Ti.UI.createButton({
		title: L('Contact support'),
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		center: {x:'50%', y:375}, //x:67
		color: '#616a75',
		font:{fontWeight:'bold',fontSize:18},
		width: 300, 
		height: 50
	})
	self.add(contactBtn);
	
	contactBtn.addEventListener('click', function() {
		var emailDialog = Ti.UI.createEmailDialog()
		emailDialog.subject = L("Noonswoon Assistant");
		emailDialog.toRecipients = ['sorry@noonswoon.com'];
		emailDialog.messageBody = L('Please let us know what went wrong with an app');
		emailDialog.barColor = '#850f16';
		emailDialog.open();
	});
	
	retryImage.addEventListener('click', function() {
		Ti.App.Flurry.logEvent('error-screen-retry');
		Ti.App.fireEvent('restartApp');
	});
	
	description1Lbl.addEventListener('click', function(){
		Ti.App.Flurry.logEvent('error-screen-retry');
		Ti.App.fireEvent('restartApp');
	});
	return self;
};

module.exports = ErrorWindow;
