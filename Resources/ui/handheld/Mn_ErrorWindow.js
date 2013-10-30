ErrorWindow = function(_errorMessage, _userId) {
	Ti.App.GATracker.trackScreen("ErrorScreen");
	
	var errorText1 = L('A problem occurred');
	var errorText2 = "";
	var showRetryOption = false;
	
	if(_errorMessage === "") {
		errorText1 = L('A problem occurred');
		errorText2 = "";
		showRetryOption = true;
	} else {
		errorMessageArray = _errorMessage.split('|');
		errorText1 = L(errorMessageArray[0]);
		errorText2 = L(errorMessageArray[1]);
	}
	
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
	var headlineLbl1 = Ti.UI.createLabel({
		text: errorText1,
		center: {x:'50%', y:'48%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl1); 
	
	var headlineLbl2 = Ti.UI.createLabel({
		text: errorText2,
		center: {x:'50%', y:'54%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl2); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: L('Retry'),
		center: {x:'56%', y:'60%'}, //x:88
		color: '#919191',
		font:{fontWeight:'bold',fontSize:18},
	});
	
	var retryImage = Ti.UI.createImageView({
		image: 'images/error/error-retry.png',
		width: 16, 
		height: 15,
		center: {x:'44%', y:'60%'}, //x:88
	});
	
	var contactButton = Ti.UI.createButton({
		width: 300, 
		height: 50,
		backgroundImage: 'images/post-onboarding-button.png',
		backgroundSelectedImage: 'images/post-onboarding-button-active.png',
		//center: {x:'50%', y:375}, //x:67
		left: 10, 
		bottom: 30
	});
	
	var contactButtonText = Ti.UI.createLabel({
		text: L('Contact Support'),
		color: '#616a75',
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'}
	});
	contactButton.add(contactButtonText);
	
	contactButton.addEventListener('click', function() {
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = L("Noonswoon Support");
		emailDialog.toRecipients = ['support@noonswoon.com'];
		emailDialog.messageBody = L('\n\n\nPlease let us know what problem you encountered') + ' (UserId: '+_userId + ', MacAddr: '+Ti.Platform.id +').';
		emailDialog.barColor = '#850f16';
		emailDialog.open();
	});
	
	self.add(contactButton);
	
	if(showRetryOption) {
		self.add(description1Lbl);
		self.add(retryImage);

		description1Lbl.addEventListener('click', function(){
			Ti.App.fireEvent('restartApp');
		});
			
		retryImage.addEventListener('click', function() {
			Ti.App.fireEvent('restartApp');
		});
	}

	return self;
};

module.exports = ErrorWindow;
