CreditBuyingWindow = function(_navGroup, _userId) {
	Ti.App.GATracker.trackScreen("CreditBuyingScreen");
	
	var BackendInAppPurchase = require('backend_libs/backendInAppPurchase');
	var CreditSystem = require('internal_libs/creditSystem');
		
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: L('Buy Credits'),
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
		separatorColor: 'transparent',
		//width:'100%',
		scrollable: false
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
	var tableData = [];
	
	//****************** Your one-time buy section ****************************************************
	var oneTimePurchaseRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 220 //220
	});
	if(Ti.Platform.osname === 'iphone')
		oneTimePurchaseRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var oneTimePurchaseSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 220,
	});
	
	var creditPackLabel = Ti.UI.createLabel({
		text: L('Credit Package'),
		center: {x: '50%', y:27}, 
		color: '#919191',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1}
	});
	oneTimePurchaseSectionView.add(creditPackLabel);
	
	var startingOffset = 50;

	var topEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset, 
		height: 5,
		left: 0, 
		width: '100%', 
	});
	oneTimePurchaseSectionView.add(topEdgeBuyCreditsView);
	
	var tenCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 5, 
		height: 48,
		left: 0, 
		width: '100%', 
		zIndex: 1
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
		text: '10', 
		color: '#e01124', //#626b76', 
		top: 5, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	tenCreditsView.add(tenCreditPrice1);
	
	var tenCreditPrice2 = Ti.UI.createLabel({
		text: 'for', 
		color: '#a3a7ad', 
		top: 5, 
		left: 90,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3
	});
	tenCreditsView.add(tenCreditPrice2);	
	
	var tenCreditPrice3 = Ti.UI.createLabel({
		text: '$0.99', 
		color: '#626b76', 
		top: 5, 
		left: 119,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 4,
	});
	tenCreditsView.add(tenCreditPrice3);	
		
	var tenCreditDesc = Ti.UI.createLabel({
		text: L('Enough to Like one person'), 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	tenCreditsView.add(tenCreditDesc);
	
	var tenCreditBuyButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundSelectedImage: 'images/credit/buy-button-active.png',
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
	oneTimePurchaseSectionView.add(tenCreditsView);

	var hundredCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
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
		text: '100', 
		color: '#e01124', 
		top: 5, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	hundredCreditsView.add(hundredCreditPrice1);

	var hundredCreditPrice2 = Ti.UI.createLabel({
		text: 'for', 
		color: '#a3a7ad', 
		top: 5, 
		left: 100,  //100 if 2 digits
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3
	});
	hundredCreditsView.add(hundredCreditPrice2);	
	
	var hundredCreditPrice3 = Ti.UI.createLabel({
		text: '$7.99', 
		color: '#626b76', 
		top: 5, 
		left: 130, //130 if 2 digits
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 4,
	});
	hundredCreditsView.add(hundredCreditPrice3);	
	
	var hundredCreditDesc = Ti.UI.createLabel({
		text: L('20% Savings'), 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	hundredCreditsView.add(hundredCreditDesc);
	
	var hundredCreditBuyButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundSelectedImage: 'images/credit/buy-button-active.png',
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
	oneTimePurchaseSectionView.add(hundredCreditsView);

	var thousandCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 101, //+ 5 + 48 + 48
		height: 48,
		left: 0, 
		width: '100%', 
	});
	var creditGlyph3 = Ti.UI.createImageView({
		image: 'images/credit/credits-glyph.png',
		top: 12, 
		left: 26,
		width: 23, 
		height: 24,
	})
	thousandCreditsView.add(creditGlyph3);

	var thousandCreditPrice1 = Ti.UI.createLabel({
		text: '1000', 
		color: '#e01124', 
		top: 5, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	thousandCreditsView.add(thousandCreditPrice1);

	var thousandCreditPrice2 = Ti.UI.createLabel({
		text: 'for', 
		color: '#a3a7ad', 
		top: 5, 
		left: 110,  //110 for 3 digits
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3
	});
	thousandCreditsView.add(thousandCreditPrice2);	
	
	var thousandCreditPrice3 = Ti.UI.createLabel({
		text: '$49.99', 
		color: '#626b76', 
		top: 5, 
		left: 140,  //140 for 3 digits
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 4,
	});
	thousandCreditsView.add(thousandCreditPrice3);	
	
	var thousandCreditDesc = Ti.UI.createLabel({
		text: L('50% Savings'), 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	thousandCreditsView.add(thousandCreditDesc);
	
	var thousandCreditBuyButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundSelectedImage: 'images/credit/buy-button-active.png',
		top: 8,
		right: 22, 
		width: 57, 
		height: 28,
	});
	
	var thousandCreditBuyButtonText = Ti.UI.createLabel({
		text: L('Buy'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	thousandCreditBuyButton.add(thousandCreditBuyButtonText);	
	thousandCreditsView.add(thousandCreditBuyButton);	
	oneTimePurchaseSectionView.add(thousandCreditsView);
	
	var bottomEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 149, //+ 5 + 48 + 48 + 48
		height: 5,
		left: 0, 
		width: '100%', 
		zIndex: 2
	});	
	oneTimePurchaseSectionView.add(bottomEdgeBuyCreditsView);

/*	
	var horizontalSeparator1 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 218,
		height: 2,
		width: '100%'
	});
	oneTimePurchaseSectionView.add(horizontalSeparator1);	
*/
	oneTimePurchaseRow.add(oneTimePurchaseSectionView);
	tableData.push(oneTimePurchaseRow);
	
	/*********************** subscription section ***********************************/

/*
	var subscriptionRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 124,  //220 - 48 - 48
	});
	if(Ti.Platform.osname === 'iphone')
		subscriptionRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var subscriptionSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 124,
	});

	var getMoreLabel1 = Ti.UI.createLabel({
		text: 'Get more with',
		top: 10, 
		left: 22,
		color: '#919191',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	subscriptionSectionView.add(getMoreLabel1);

	var getMoreLabel2 = Ti.UI.createLabel({
		text: L('Monthly Subscription'),
		center: {x:'50%', y: 27},
		//top: 10,
		//left: 133,
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:16},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1},
	});
	subscriptionSectionView.add(getMoreLabel2);

	var unlimitedCreditsLabel = Ti.UI.createLabel({
		text: 'As many likes and friend reveals as you want',
		center: {x:'50%', y: 40},
		color: '#a3a7ad',
		font:{fontSize:14},
		zIndex:3
	});
	subscriptionSectionView.add(unlimitedCreditsLabel);	


	var centerOffset = 123; 
	
	var topEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset,
		height: 5,
		left: 0, 
		width: '100%', 
	});
	subscriptionSectionView.add(topEdgeSubscriptionView);
	
	var monthlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 5,
		height: 48,
		left: 0, 
		width: '100%', 
		zIndex: 2,
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
		top: 5, //12, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	monthlySubscriptionView.add(monthlyPrice1);

	var monthlyPrice2 = Ti.UI.createLabel({
		text: '/month', 
		color: '#a3a7ad', 
		top: 5, //12, 
		left: 110,
		font:{fontWeight:'bold',fontSize:18},
	});
	monthlySubscriptionView.add(monthlyPrice2);	
	
	var monthlyDesc = Ti.UI.createLabel({
		text: L('You can Like anyone'), 
		color: '#a3a7ad',
		top: 25, 
		left: 65,
		font:{fontSize:14},
	});
	monthlySubscriptionView.add(monthlyDesc);	
	
	var monthlySubscribeButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundSelectedImage: 'images/credit/buy-button-active.png',
		top: 8,
		right: 22, 
		width: 57, 
		height: 28,
	});	
	
	var monthlySubscribeButtonText = Ti.UI.createLabel({
		text: L('Buy'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	monthlySubscribeButton.add(monthlySubscribeButtonText);	
	monthlySubscriptionView.add(monthlySubscribeButton);	
	subscriptionSectionView.add(monthlySubscriptionView);
*/

/*** 3 months ***/
/*
	var quarterlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 53, //+ 5 + 48 
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
	quarterlySubscriptionView.add(subscribeGlyph2);
	
	var quarterlyPrice1 = Ti.UI.createLabel({
		text: '$39.99', 
		color: '#4e5866', 
		top: 12, 
		left: 65,
		font:{fontWeight:'bold',fontSize:18},
	});
	quarterlySubscriptionView.add(quarterlyPrice1);

	var quarterlyPrice2 = Ti.UI.createLabel({
		text: '/quarter', 
		color: '#a3a7ad', 
		top: 12, 
		left: 120,
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 5
	});
	quarterlySubscriptionView.add(quarterlyPrice2);	
	
	var quarterlySubscribeButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/subscribe-button.png',
		backgroundSelectedImage: 'images/credit/subscribe-button-active.png',
		top: 8,
		right: 22, 
		width: 101, 
		height: 28,
	});
	
	var quarterlySubscribeButtonText = Ti.UI.createLabel({
		text: L('Subscribe'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	quarterlySubscribeButton.add(quarterlySubscribeButtonText);	
	quarterlySubscriptionView.add(quarterlySubscribeButton);
	subscriptionSectionView.add(quarterlySubscriptionView);
*/
	/*** end 3 months ***/

/*	
	var yearlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 101, //+ 5 + 48 
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
		backgroundSelectedImage: 'images/credit/subscribe-button-active.png',
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
	subscriptionSectionView.add(yearlySubscriptionView);
*/
/*
	var bottomEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 51, //101 + 5 + 48 //no yearly anymore + 48 
		height: 5,
		left: 0, 
		width: '100%', 
		zIndex:3
	});	
	subscriptionSectionView.add(bottomEdgeSubscriptionView);
	
	var horizontalSeparator2 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 122,
		height: 2,
		width: '100%'
	});
	subscriptionSectionView.add(horizontalSeparator2);
	subscriptionRow.add(subscriptionSectionView);
	tableData.push(subscriptionRow);	
	
	var restoreRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 66,  //220 - 48 - 48
	});
	if(Ti.Platform.osname === 'iphone')
		restoreRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var restoreView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 66,
	});
	
	var restoreButton = Ti.UI.createButton({
		top: 10,
		left: 10,
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundSelectedImage: 'images/credit/big-btn-active.png', 
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
	restoreView.add(restoreButton);
	restoreRow.add(restoreView);
	tableData.push(restoreRow);
*/

	contentView.data = tableData;
	self.add(contentView);
	
	/************************ END OF UI STUFF **************************/
	var purchasedConfirmationDialog = Titanium.UI.createAlertDialog({
		title: L('Thank you!'),
		message:L('Your purchase is complete'),
		buttonNames: [L('Continue')],
		cancel: 0
	});
	
	var restoredConfirmationDialog = Titanium.UI.createAlertDialog({
		title: L('Thank you!'),
		message:L('Your Noonswoon purchase is restored'),
		buttonNames: [L('Continue')],
		cancel: 0
	});	

	var transactionStateCallback = function(evt) {
		switch (evt.state) {
			case Ti.App.Storekit.FAILED:
				if (evt.cancelled) {
					Ti.App.LogSystem.logSystemData('error', 'User cancelled a purchase', _userId, Ti.App.Facebook.uid);
				} else {
					alert('Purchasing failed: ' + evt.message);
					Ti.App.LogSystem.logSystemData('error', 'Some failure prevent user from buying credits: '+evt.message, _userId, Ti.App.Facebook.uid);
				}
				hidePreloader(self);
				break;
			case Ti.App.Storekit.PURCHASED:
				//need to send this evt to verify at the server
				BackendInAppPurchase.verifyReceipt(_userId, evt.receipt, evt.productIdentifier, function(e) {
					if(e.success) {						
						if(e.content.customer_type !== undefined) {
							Ti.App.CUSTOMER_TYPE = e.content.customer_type;  //either regular or subscription
							Ti.API.info('customer_type: '+e.content.customer_type);
						} else {
							Ti.API.info('no customer type after purchased');
						}
						
						//update the credit
						CreditSystem.setUserCredit(e.content.credit); //sync the credit

						//pop up for success purchase confirmation
						purchasedConfirmationDialog.show(); 
					}
					//then close the window
					_navGroup.close(self, {animated:true}); //go to the main screen
				});
				hidePreloader(self);

				break;
			case Ti.App.Storekit.PURCHASING:
				Ti.App.LogSystem.logSystemData('info', 'Purchasing ' + evt.productIdentifier, _userId, Ti.App.Facebook.uid);
				break;
			case Ti.App.Storekit.RESTORED:
				// The complete list of restored products is sent with the `restoredCompletedTransactions` event
				Ti.API.info("Restored " + evt.productIdentifier);
			    break;
		}
	};
	Ti.App.Storekit.addEventListener('transactionState', transactionStateCallback);
	
	function purchaseProduct(product)
	{
		showPreloader(self, L('Purchasing...'));
		Ti.App.Storekit.purchase(product);
	}

	function restorePurchases()
	{
		showPreloader(self, L('Restoring...'));
		Ti.App.Storekit.restoreCompletedTransactions();
	}

	var compareTransactions = function(a, b) {
    	if(a.date < b.date) return -1; //เวลาน้อยกว่า (เกิดก่อน) มาก่อนใน array
    	if(a.date > b.date) return 1; 
    	return 0;
    };

/*	
	var restoredCompletedTransactionsCallback = function(evt) {
		hidePreloader(self);
		if (evt.error) {
			alert('Restored failed: ' + evt.error);
			Ti.App.LogSystem.logSystemData('error', 'Some failure prevent user from restoring: '+evt.error, _userId, Ti.App.Facebook.uid);		
		} else if (evt.transactions == null || evt.transactions.length == 0) {
			alert(L('There were no Noonswoon purchase to restore'));
		} else {
			evt.transactions.sort(compareTransactions); //sorted so the first one is the earliest, assuming to be original
			if(evt.transactions.length > 0) {
				Ti.App.LogSystem.logSystemData('info', 'Restored ' + evt.transactions[0].productIdentifier, _userId, Ti.App.Facebook.uid);
				BackendInAppPurchase.verifyReceipt(_userId, evt.transactions[0].receipt, evt.transactions[0].productIdentifier, function(e) {
					if(e.success) {						
						//Ti.API.info('restored return verify: '+JSON.stringify(e));
						if(e.content.customer_type !== undefined) {
							Ti.App.CUSTOMER_TYPE = e.content.customer_type;  //either regular or subscription
							Ti.API.info('customer_type: '+e.content.customer_type);
						} else {
							Ti.API.info('no customer type after purchased');
						}
						
						//update the credit
						CreditSystem.setUserCredit(e.content.credit); //sync the credit

						//pop up for success purchase confirmation
						restoredConfirmationDialog.show(); 
					}
					//then close the window
					_navGroup.close(self, {animated:true}); //go to the main screen
				});
			}
		}
	};
	Ti.App.Storekit.addEventListener('restoredCompletedTransactions', restoredCompletedTransactionsCallback);

	restoreButton.addEventListener('click', function () {
		restorePurchases();
	});
*/

	showPreloader(self, L('Loading...'));
	Ti.App.Storekit.requestProducts(Ti.App.NOONSWOON_PRODUCTS, function (evt) {
		Ti.API.info('requestProducts: '+JSON.stringify(evt));
		hidePreloader(self);
		if (!evt.success) {
			Ti.App.LogSystem.logSystemData('error', 'Failed to talk to Apple', _userId, Ti.App.Facebook.uid);
		} else if (evt.invalid) {
			Ti.App.LogSystem.logSystemData('error', 'Request an invalid product!', _userId, Ti.App.Facebook.uid);			
		} else {
			//success(evt.products);
			var products = evt.products;	
			for(var i = 0; i < products.length; i++) {
				var product = products[i];
				(function() { //double binding, change execution context
					var currentProduct = product;
					if(currentProduct.identifier === 'com.noonswoon.launch.c1') {
						tenCreditPrice3.text = currentProduct.formattedPrice;
						tenCreditBuyButton.addEventListener('click', function() {
							purchaseProduct(currentProduct);
							Ti.App.GATracker.trackEvent({
								category: "CreditPurchase",
								action: "PurchaseButtonClicked",
								label: "TenCredits",
								value: 0.99
							});
						});
					}  else if(currentProduct.identifier === 'com.noonswoon.launch.c2') {
						hundredCreditPrice3.text = currentProduct.formattedPrice;
						hundredCreditBuyButton.addEventListener('click', function() {
							purchaseProduct(currentProduct);
							Ti.App.GATracker.trackEvent({
								category: "CreditPurchase",
								action: "PurchaseButtonClicked",
								label: "HundredCredits",
								value: 7.99
							});
						});
					} else if(currentProduct.identifier === 'com.noonswoon.launch.c3') {
						thousandCreditPrice3.text = currentProduct.formattedPrice;
						thousandCreditBuyButton.addEventListener('click', function() {
							purchaseProduct(currentProduct);
							Ti.App.GATracker.trackEvent({
								category: "CreditPurchase",
								action: "PurchaseButtonClicked",
								label: "ThousandCredits",
								value: 49.99
							});
						});
					} /* else if(currentProduct.identifier === 'com.noonswoon.launch.monthly.d10') {
						monthlyPrice1.text = currentProduct.formattedPrice;
						monthlySubscribeButton.addEventListener('click', function() {
							purchaseProduct(currentProduct);
						});
					} else if(currentProduct.identifier === 'com.noonswoon.launch.yearly') {
						yearlyPrice1.text = currentProduct.formattedPrice;
						yearlySubscribeButton.addEventListener('click', function() {
							purchaseProduct(currentProduct);
						});
					} */
				})();
			}
		}
	});
	
	var windowCloseCallback = function(e) {
		Ti.App.Storekit.removeEventListener('transactionState', transactionStateCallback);
		//Ti.App.Storekit.removeEventListener('restoredCompletedTransactions', restoredCompletedTransactionsCallback);
		self.removeEventListener('close', windowCloseCallback);
	};
	self.addEventListener('close', windowCloseCallback);
			
	return self;
};

module.exports = CreditBuyingWindow;

