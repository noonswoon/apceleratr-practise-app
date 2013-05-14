CreditWindow = function() {
	//Ti.App.Flurry.logEvent('buy-credit-screen');
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: 'Credits',
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	var getCreditsLabel = Ti.UI.createLabel({
		text: 'Get Credits',
		center: {x: '50%', y:27}, 
		color: '#8f8f8f',
		font:{fontWeight:'bold',fontSize:18},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1}
	});
	self.add(getCreditsLabel);
	
	var startingOffset = 50;

	var topEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset, 
		height: 5,
		left: 0, 
		width: '100%', 
	});
	self.add(topEdgeBuyCreditsView);
	
	var tenCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 5, 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(tenCreditsView);
	
	var hundredCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 53, //+ 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(hundredCreditsView);
	
	var bottomEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 101, //+ 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeBuyCreditsView);
	
	var centerOffset = 75; 
	
	var topEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset + 101 + centerOffset, //+ 5 + 48 + 48 + centerOffset
		height: 5,
		left: 0, 
		width: '100%', 
	});
	self.add(topEdgeSubscriptionView);
	
	var monthlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 106 + centerOffset, //+5 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(monthlySubscriptionView);
	
	var yearlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 154 + centerOffset, //101 + 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(yearlySubscriptionView);
	
	var bottomEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 202 + centerOffset, //101 + 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeSubscriptionView);

	
	return self;
};

module.exports = CreditWindow;

