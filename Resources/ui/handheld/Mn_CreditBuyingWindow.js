CreditBuyingWindow = function(_navGroup, _userId) {
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: 'Buy Credits',
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	var creditPackLabel = Ti.UI.createLabel({
		text: 'Credit Packs',
		center: {x: '50%', y:27}, 
		color: '#919191',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1}
	});
	self.add(creditPackLabel);
	
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
	
	var creditGlyph1 = Ti.UI.createImageView({
		image: 'images/credit/credits-glyph.png',
		top: 12, 
		left: 26,
		width: 23, 
		height: 24,
	})
	tenCreditsView.add(creditGlyph1);
	
	var tenCreditPrice1 = Ti.UI.createLabel({
		text: '$0.99', 
		color: '#626b76', //#e01124', 
		top: 5, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	tenCreditsView.add(tenCreditPrice1);
	
	var tenCreditPrice2 = Ti.UI.createLabel({
		text: 'for', 
		color: '#a3a7ad', 
		top: 5, 
		left: 115,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3
	});
	tenCreditsView.add(tenCreditPrice2);	
	
	var tenCreditPrice3 = Ti.UI.createLabel({
		text: '10', 
		color: '#e01124', 
		top: 5, 
		left: 144,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 4,
	});
	tenCreditsView.add(tenCreditPrice3);	
		
	var tenCreditDesc = Ti.UI.createLabel({
		text: 'Enough to get you started', 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	tenCreditsView.add(tenCreditDesc);
	
	var tenCreditBuyButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundFocusedImage: 'images/credit/buy-button-active.png',
		top: 8,
		right: 22, 
		width: 57, 
		height: 28,
	});
	
	var tenCreditBuyButtonText = Ti.UI.createLabel({
		text: L('Buy'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	tenCreditBuyButton.add(tenCreditBuyButtonText);	
	tenCreditsView.add(tenCreditBuyButton);	
	
	self.add(tenCreditsView);
	
	var hundredCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 53, //+ 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	var creditGlyph2 = Ti.UI.createImageView({
		image: 'images/credit/credits-glyph.png',
		top: 12, 
		left: 26,
		width: 23, 
		height: 24,
	})
	hundredCreditsView.add(creditGlyph2);

	var hundredCreditPrice1 = Ti.UI.createLabel({
		text: '$9.99', 
		color: '#626b76', 
		top: 5, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	hundredCreditsView.add(hundredCreditPrice1);

	var hundredCreditPrice2 = Ti.UI.createLabel({
		text: 'for', 
		color: '#a3a7ad', 
		top: 5, 
		left: 115,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3
	});
	hundredCreditsView.add(hundredCreditPrice2);	
	
	var hundredCreditPrice3 = Ti.UI.createLabel({
		text: '100', 
		color: '#e01124', 
		top: 5, 
		left: 144,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 4,
	});
	hundredCreditsView.add(hundredCreditPrice3);	
	
	var hundredCreditDesc = Ti.UI.createLabel({
		text: '20% saving!', 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	hundredCreditsView.add(hundredCreditDesc);
	
	var hundredCreditBuyButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundFocusedImage: 'images/credit/buy-button-active.png',
		top: 8,
		right: 22, 
		width: 57, 
		height: 28,
	});
	
	var hundredCreditBuyButtonText = Ti.UI.createLabel({
		text: L('Buy'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	hundredCreditBuyButton.add(hundredCreditBuyButtonText);	
	hundredCreditsView.add(hundredCreditBuyButton);	

	self.add(hundredCreditsView);
	
	var bottomEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 101, //+ 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeBuyCreditsView);
	
	var horizontalSeparator1 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 170,
		height: 2,
		width: '100%'
	});
	self.add(horizontalSeparator1);
	
	/*********************** subscription section ***********************************/
	var getMoreLabel1 = Ti.UI.createLabel({
		text: 'Get more with',
		top: 182, 
		left: 22,
		color: '#919191',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(getMoreLabel1);
	
	var getMoreLabel2 = Ti.UI.createLabel({
		text: 'Noonswoon Unlimited',
		top: 182,
		left: 133,
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	self.add(getMoreLabel2);
	
	var unlimitedCreditsLabel = Ti.UI.createLabel({
		text: 'Unlimited likes and friend reveals',
		center: {x:'50%', y: 211},
		color: '#a3a7ad',
		font:{fontSize:14},
		zIndex:3
	});
	self.add(unlimitedCreditsLabel);	
	
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
	
	var subscribeGlyph1 = Ti.UI.createImageView({
		image: 'images/credit/subscribe-glyph.png',
		top: 12, 
		left: 26,
		width: 17, 
		height: 26,
	})
	monthlySubscriptionView.add(subscribeGlyph1);

	var monthlyPrice1 = Ti.UI.createLabel({
		text: '$9.99', 
		color: '#4e5866', 
		top: 12, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	monthlySubscriptionView.add(monthlyPrice1);

	var monthlyPrice2 = Ti.UI.createLabel({
		text: '/month', 
		color: '#a3a7ad', 
		top: 12, 
		left: 110,
		font:{fontWeight:'bold',fontSize:18},
	});
	monthlySubscriptionView.add(monthlyPrice2);	
	
	var monthlySubscribeButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/subscribe-button.png',
		backgroundFocusedImage: 'images/credit/subscribe-button-active.png',
		top: 8,
		right: 22, 
		width: 101, 
		height: 28,
	});
	
	var monthlySubscribeButtonText = Ti.UI.createLabel({
		text: L('Subscribe'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	monthlySubscribeButton.add(monthlySubscribeButtonText);	
	monthlySubscriptionView.add(monthlySubscribeButton);	

	self.add(monthlySubscriptionView);
	
	var yearlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 154 + centerOffset, //101 + 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	var subscribeGlyph2 = Ti.UI.createImageView({
		image: 'images/credit/subscribe-glyph.png',
		top: 12, 
		left: 26,
		width: 17, 
		height: 26,
	})
	yearlySubscriptionView.add(subscribeGlyph2);
	
	var yearlyPrice1 = Ti.UI.createLabel({
		text: '$59.99', 
		color: '#4e5866', 
		top: 12, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	yearlySubscriptionView.add(yearlyPrice1);
	
	var yearlyPrice2 = Ti.UI.createLabel({
		text: '/year', 
		color: '#a3a7ad', 
		top: 12, 
		left: 120,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 5
	});
	yearlySubscriptionView.add(yearlyPrice2);	
	
	var yearlySubscribeButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/subscribe-button.png',
		backgroundFocusedImage: 'images/credit/subscribe-button-active.png',
		top: 8,
		right: 22, 
		width: 101, 
		height: 28,
	});
	
	var yearlySubscribeButtonText = Ti.UI.createLabel({
		text: L('Subscribe'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	yearlySubscribeButton.add(yearlySubscribeButtonText);	
	yearlySubscriptionView.add(yearlySubscribeButton);

	self.add(yearlySubscriptionView);
	
	var bottomEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 202 + centerOffset, //101 + 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeSubscriptionView);

	var horizontalSeparator2 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		bottom: 71,
		height: 2,
		width: '100%'
	});
	self.add(horizontalSeparator2);
	
	var restoreButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundFocusedImage: 'images/credit/big-btn-active.png', 
		left: 10,
		bottom: 12,
	});
	
	var restoreButtonText = Ti.UI.createLabel({
		text: L('Restore Purchases'),
		color: '#636c78',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	restoreButton.add(restoreButtonText);	
	self.add(restoreButton);
	
	return self;
};

module.exports = CreditBuyingWindow;

