CreditSampleWindow = function() {
	
	//Ti.App.Flurry.logEvent('buy-credit-screen');
	
	//create component instance
	
	var verifyingReceipts = false;

	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
		
	var self = Ti.UI.createWindow({
		title: 'Credit',
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	/*
	 We want to show the user when we're communicating with the server, so let's define two simple
	 functions that interact with an activity indicator.
	 */
	var loading = Ti.UI.createActivityIndicator({
		bottom:10, height:50, width:50,
		backgroundColor:'black', borderRadius:10,
		style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG
	});
	var loadingCount = 0;
	function showLoading()
	{
		loadingCount += 1;
		if (loadingCount == 1) {
			loading.show();
		}
	}
	
	function hideLoading()
	{
		if (loadingCount > 0) {
			loadingCount -= 1;
			if (loadingCount == 0) {
				loading.hide();
			}
		}
	}
	self.add(loading);

	/*
	 Now let's define a couple utility functions. We'll use these throughout the app.
	 */
	var tempPurchasedStore = {};
	
	/**
	 * Keeps track (internally) of purchased products.
	 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
	 */
	function markProductAsPurchased(identifier)
	{
		Ti.API.info('Marking as purchased: ' + identifier);
		// Store it in an object for immediate retrieval.
		tempPurchasedStore[identifier] = true;
		// And in to Ti.App.Properties for persistent storage.
		Ti.App.Properties.setBool('Purchased-' + identifier, true);
	}
	
	/**
	 * Checks if a product has been purchased in the past, based on our internal memory.
	 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
	 */
	function checkIfProductPurchased(identifier)
	{
		Ti.API.info('Checking if purchased: ' + identifier);
		if (tempPurchasedStore[identifier] === undefined)
			tempPurchasedStore[identifier] = Ti.App.Properties.getBool('Purchased-' + identifier, false);
		return tempPurchasedStore[identifier];
	}
	
	/**
	 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
	 * price for the current user.
	 * @param identifier The identifier of the product, as specified in iTunesConnect.
	 * @param success A callback function.
	 * @return A Ti.Storekit.Product.
	 */
	function requestProduct(identifier, success)
	{
		showLoading();
		Ti.App.Storekit.requestProducts([identifier], function (evt) {
			hideLoading();
			Ti.API.info('requestProduct: '+JSON.stringify(evt));
			if (!evt.success) {
				alert('ERROR: We failed to talk to Apple!');
			}
			else if (evt.invalid) {
				alert('ERROR: We requested an invalid product!');
			}
			else {
				success(evt.products[0]);
			}
		});
	}
	
	/**
	 * Purchases a product.
	 * @param product A Ti.Storekit.Product (hint: use Storekit.requestProducts to get one of these!).
	 */
	Ti.App.Storekit.addEventListener('transactionState', function (evt) {
		hideLoading();
		Ti.API.info('transactionState: '+JSON.stringify(evt));
		switch (evt.state) {
			case Ti.App.Storekit.FAILED:
				if (evt.cancelled) {
					alert('Purchase cancelled');
				} else {
					alert('ERROR: Buying failed! ' + evt.message);
				}
				break;
			case Ti.App.Storekit.PURCHASED:
				//need to send this evt to verify at the server
				Ti.App.Storekit.verifyReceipt(evt, function (e) {
					Ti.API.info('recieptResult: '+JSON.stringify(e));
					if (e.success) {
						if (e.valid) {
							alert('Thanks! Receipt Verified');
							markProductAsPurchased(evt.productIdentifier);
						} else {
							alert('Sorry. Receipt is invalid');
						}
					} else {
						alert(e.message);
					}
				});
				break;
			case Ti.App.Storekit.PURCHASING:
				Ti.API.info("Purchasing " + evt.productIdentifier);
				break;
			case Ti.App.Storekit.RESTORED:
				// The complete list of restored products is sent with the `restoredCompletedTransactions` event
				Ti.API.info("Restored " + evt.productIdentifier);
			    break;
		}
	});
	
	function purchaseProduct(product)
	{
		showLoading();
		Ti.App.Storekit.purchase(product);
	}
	
	/**
	 * Restores any purchases that the current user has made in the past, but we have lost memory of.
	 */
	function restorePurchases()
	{
		showLoading();
		Ti.App.Storekit.restoreCompletedTransactions();
	}
	
	Ti.App.Storekit.addEventListener('restoredCompletedTransactions', function (evt) {
		hideLoading();
		if (evt.error) {
			alert(evt.error);
		} else if (evt.transactions == null || evt.transactions.length == 0) {
			alert('There were no purchases to restore!');
		} else {
			for (var i = 0; i < evt.transactions.length; i++) {
				Ti.App.Storekit.verifyReceipt(evt.transactions[i], function (e) {
					if (e.valid) {
						markProductAsPurchased(e.productIdentifier);
					} else {
						Ti.API.error("Restored transaction is not valid");
					}
				});
			}
			alert('Restored ' + evt.transactions.length + ' purchases!');
		}
	});

	/*
	 1) Can the user make payments? Their device may be locked down, or this may be a simulator.
	 */
	if (!Ti.App.Storekit.canMakePayments)
		alert('This device cannot make purchases!');
	else {
	
		/*
		 2) Tracking what the user has purchased in the past.
		 */
		var whatHaveIPurchased = Ti.UI.createButton({
			title:'What Have I Purchased?',
			top:10, left:5, right:5, height:40
		});
		whatHaveIPurchased.addEventListener('click', function () {
			alert({
				'10 Credits':checkIfProductPurchased('com.noonswoon.launch.c1') ? 'Purchased!' : 'Not Yet',
				'100 Credits':checkIfProductPurchased('com.noonswoon.launch.c2') ? 'Purchased!' : 'Not Yet',
				'Monthly Subscription':checkIfProductPurchased('com.noonswoon.launch.monthly') ? 'Purchased!' : 'Not Yet',
				'Yearly Subscription':checkIfProductPurchased('com.noonswoon.launch.yearly') ? 'Purchased!' : 'Not Yet'
				
			});
		});
		self.add(whatHaveIPurchased);
	
		/*
		 3) Buying stuff
		 */
		
		/*
		 3.1 Buying 10 credits.
		 */
		requestProduct('com.noonswoon.launch.c1', function (product) {
			var buyTenCredits = Ti.UI.createButton({
				title:'Buy ' + product.title + ', ' + product.formattedPrice,
				top:60, 
				left:5,  
				right: 5,
				height:40
			});
			
			buyTenCredits.addEventListener('click', function () {
				purchaseProduct(product);
			});
			
			self.add(buyTenCredits);
		});
	
		/*
		 3.2 Buying 100 credits.
		 */
		requestProduct('com.noonswoon.launch.c2', function (product) {
			var buyHundredCredits = Ti.UI.createButton({
				title:'Buy ' + product.title + ', ' + product.formattedPrice,
				top:110, 
				left:5, 
				right: 5, 
				height:40
			});
			
			buyHundredCredits.addEventListener('click', function () {
				purchaseProduct(product);
			});
			
			self.add(buyHundredCredits);
		});
		
		/*
		 3.3 Buying monthly subscription
		 */
		requestProduct('com.noonswoon.launch.monthly', function (product) {
			var buyMonthlySubscription = Ti.UI.createButton({
				title:'Buy ' + product.title + ', ' + product.formattedPrice,
				top:160, 
				left:5,
				right: 5, 
				height:40
			});
			
			buyMonthlySubscription.addEventListener('click', function () {
				purchaseProduct(product);
			});
			
			self.add(buyMonthlySubscription);
		});
	
		/*
		 3.4 Buying annual subscription
		 */
		requestProduct('com.noonswoon.launch.yearly', function (product) {
			var buyAnnualSubscription = Ti.UI.createButton({
				title:'Buy ' + product.title + ', ' + product.formattedPrice,
				top:210, 
				left:5, 
				right: 5,
				height:40
			});
			
			buyAnnualSubscription.addEventListener('click', function () {
				purchaseProduct(product);
			});
			
			self.add(buyAnnualSubscription);
		});
		
		/*
		 4) Restoring past purchases.
		 */
		var restoreCompletedTransactions = Ti.UI.createButton({
			title:'Restore Lost Purchases',
			top:260,
			left:5, 
			right: 5,
			height:40
		});
		
		restoreCompletedTransactions.addEventListener('click', function () {
			restorePurchases();
		});
		self.add(restoreCompletedTransactions);
	}
	return self;
};

module.exports = CreditSampleWindow;
