RedeemCreditWindow = function(_navGroup, _userId) {
	Ti.App.NSAnalytics.trackScreen("RedeemCreditScreen");
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: L('Redeem Candy'),  //Buy Credits
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});

	var redeemLabel1 = Ti.UI.createLabel({
		text: 'Please enter your redeem code',
		center: {x:'50%', y:50}, //x:67
		color: '#666666',
		font:{fontWeight:'bold',fontSize:18},
	});
	self.add(redeemLabel1); 
	
	var inputCreditBackground = Ti.UI.createImageView({
		image: 'images/credit/credits-label-bg.png',
		top: 100, 
		left: 8,
		height: 46,
		width: 302,
		zIndex: 2
	});
	
	var redeemTextfield = Ti.UI.createTextField({
		width: 60, 
		height: 60,
		center: {x:'50%', y:20}, //x:67
		zIndex: 2,
//		backgroundColor: 'orange',
		font:{fontWeight:'bold',fontSize:22},
	});
	inputCreditBackground.add(redeemTextfield);
	var isOnFocus = false;
	
	inputCreditBackground.addEventListener('click', function(e) {
		e.cancelBubble = true;
		redeemTextfield.focus();
		isOnFocus = true;
	});
	
	self.addEventListener('click', function() {
		if(isOnFocus) {
			redeemTextfield.blur();
			isOnFocus = false;
		}
	});
	
	redeemTextfield.addEventListener('focus', function() {
		isOnFocus = true;
	});
	
	redeemTextfield.addEventListener('blur', function() {
		isOnFocus = false;
	});
	
	self.add(inputCreditBackground);
	
	var redeemButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundSelectedImage: 'images/credit/big-btn-active.png', 
		center: {x:'50%', y:180}, //x:67
		zIndex: 2,
	});
	
	var redeemButtonText = Ti.UI.createLabel({
		text: L('Redeem'),
		color: '#636c78',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	redeemButton.add(redeemButtonText);	
	
	redeemButton.addEventListener('click', function() {
		var redeemCode = redeemTextfield.value; 
		if(redeemCode.length !== 4) {
			var redeemCodeWarningDialog = Titanium.UI.createAlertDialog({
				title: L('Invalid Redeem Code'),
				message: L('Please check your redeem code and enter again'),
				buttonNames: [L('Ok')],
			});
			redeemCodeWarningDialog.show();
		} else {
			var BackendCredit = require('backend_libs/backendCredit');
			BackendCredit.redeemCode(_userId, redeemCode, function(e) {
				if(e.success) {			
					if(e.content.customer_type !== undefined) {
						Ti.App.CUSTOMER_TYPE = e.content.customer_type;  //either regular or subscription
					}
					//update the credit
					var CreditSystem = require('internal_libs/creditSystem');
					CreditSystem.setUserCredit(e.content.credit); //sync the credit

					//pop up for success purchase confirmation
					var redeemConfirmationDialog = Titanium.UI.createAlertDialog({
						title: L('Thank you!'),
						message:L('You successfully redeemed your candy'),
						buttonNames: [L('Continue')],
						cancel: 0
					});
					
					redeemConfirmationDialog.show();
					//then close the window
					_navGroup.close(self, {animated:true}); //go to the main screen
				} else {
					var badRedeemCodeDialog = Titanium.UI.createAlertDialog({
						title: L('Invalid Redeem Code'),
						message: L('Sorry, your redeem code is invalid/expired.'),
						buttonNames: [L('Ok')],
					});
					badRedeemCodeDialog.show();
				}
			});
		}
	});
	self.add(redeemButton);
	
	var redeemDescLabel1 = Ti.UI.createLabel({
		text: 'สำหรับลูกค้า AIS, ท่านสามารถซื้อ Candy ได้โดยการกด',
		center: {x:'50%', y:250}, //x:67
		color: '#666666',
		font:{fontSize:14},
	});
	self.add(redeemDescLabel1); 

	var redeemDescLabel2 = Ti.UI.createLabel({
		text: '*40020010000 สำหรับ 15 candy ในราคา 29 บาท',
		center: {x:'50%', y:280}, //x:67
		color: '#666666',
		font:{fontSize:14},
	});
	self.add(redeemDescLabel2); 
	
	var redeemDescLabel3 = Ti.UI.createLabel({
		text: '*40020020000 สำหรับ 60 candy ในราคา 99 บาท',
		center: {x:'50%', y:305}, //x:67
		color: '#666666',
		font:{fontSize:14},
	});
	self.add(redeemDescLabel3); 		
	return self;
};

module.exports = RedeemCreditWindow;

