CreditOverviewWindow = function() {
	
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

	// Your credit/buy/invite friends section
	var yourCreditsSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 200,
	});

	var currentCreditBackground = Ti.UI.createImageView({
		image: 'images/credit/credits-label-bg.png',
		top: 15, 
		left: 8,
		height: 46,
		width: 302,
		zIndex: 2
	});
	
	var creditGlyph = Ti.UI.createImageView({
		image: 'images/credit/credits-glyph.png',
		top: 12,
		left: 16,
		width: 23, 
		height: 24,
		zIndex: 3,
	});
	currentCreditBackground.add(creditGlyph);
	
	var yourCreditLabel = Ti.UI.createLabel({
		text: 'Your Credits',
		top: 13,
		left: 54, 
		color: '#666666',
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3,
	});
	currentCreditBackground.add(yourCreditLabel);
	
	var creditAmoutLabel = Ti.UI.createLabel({
		text: '100',
		top: 12,
		right: 16, 
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		zIndex: 3,
	});
	currentCreditBackground.add(creditAmoutLabel);
	yourCreditsSectionView.add(currentCreditBackground);
	
	var buyCreditButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/credits-big-btn-red.png', 
		backgroundFocusedImage: 'images/credit/credits-big-btn-red-active.png', 
		center: {x:'50%', y:98}, //x:67
		zIndex: 2,
	});
	
	var buyCreditButtonText = Ti.UI.createLabel({
		text: L('Buy Credits'),
		color: '#eff2f7',
		shadowColor: '#590a10',
		shadowOffset: {x:0, y:2},
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	buyCreditButton.add(buyCreditButtonText);	
	yourCreditsSectionView.add(buyCreditButton);
	
	var inviteFriendsButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundFocusedImage: 'images/credit/big-btn-active.png', 
		center: {x:'50%', y:153}, //x:67
		zIndex: 2,
	});
	
	var inviteFriendsButtonText = Ti.UI.createLabel({
		text: L('Invite Friends, get free credits'),
		color: '#636c78',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	inviteFriendsButton.add(inviteFriendsButtonText);	
	yourCreditsSectionView.add(inviteFriendsButton);	
	
	var horizontalSeparator = Ti.UI.createImageView({
		image: 'horizontal-separator.png', 
		bottom: 0,
		height: 2,
		width: '100%'
	});
	yourCreditsSectionView.add(horizontalSeparator);
	self.add(yourCreditsSectionView);

	// How credits are used section

	//earned free credits section

/*	var getCreditsLabel = Ti.UI.createLabel({
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
*/
	
	return self;
};

module.exports = CreditOverviewWindow;

