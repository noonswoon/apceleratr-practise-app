NoInternetWindow = function(_userId) {
	
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee'
	});

	var imageView = Ti.UI.createImageView({
		image: 'images/error/message-no-internet.png',
		width: 190, 
		height: 146,
		center: {x:'50%', y:'30%'}
	});
	self.add(imageView); 
					
	//80868e  headline
	var headlineLbl = Ti.UI.createLabel({
		text: 'No Internet Connection',
		center: {x:'50%', y:'50%'}, //x:70
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1}
	});
	self.add(headlineLbl); 
	
	//a6a9ae description
	var description1Lbl = Ti.UI.createLabel({
		text: 'Retry',
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


	return self;
};

module.exports = NoInternetWindow;
