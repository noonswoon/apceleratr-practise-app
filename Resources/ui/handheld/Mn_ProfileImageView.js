ProfileImageView = function(_navGroup, _pictures, _userId, _matchId, _showButtons) {
	var CustomPagingControl = require('external_libs/customPagingControl');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendMatch = require('backend_libs/backendMatch');

	var navGroup = null;
	var isActionTaken = false;
	
	var viewsForScrollView = [];
	var imagesArray = [];
	
	var self = Ti.UI.createView({
		top: 0,
		left: 0,
		width: 320,
		height: 338,
		zIndex: 0	
	});
	
	var view = null;

	for(var i = 0; i < _pictures.length; i++) {
		var img = _pictures[i].src; //Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/'+ _pictures[i].src);
		imagesArray.push(img);

		var imgView = Titanium.UI.createImageView({
			top: 0,
			left: 0,
			image:img,
			width: 320,
			height: 'auto',
			zIndex: 1,
		});
		
		var overlayView = Ti.UI.createImageView({
			backgroundImage: 'images/home-image-overlays.png',
			width: 320,
			height: 338,
			zIndex: 2
		});
		
		var placeHolderView = Ti.UI.createView({
			imgView: imgView,
			width: 320,
			height: 338,
			zIndex:0,
		});
		
		placeHolderView.add(imgView);
		placeHolderView.add(overlayView);
		viewsForScrollView.push(placeHolderView);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		showPagingControl:false,
		currentPage:0,
		height: 338,
		top:0,
		left:0,
		disableBounce: true,
		zIndex: 0
	});	
	self.add(scrollView);
	
	var likeButton = Ti.UI.createButton({
		backgroundImage: 'images/big-like-btn.png',
		backgroundSelectedImage: 'images/big-like-btn-active.png',
		bottom: 10,
		left: 7,
		width: 308,
		height: 53,
		zIndex: 3
	});

	var buttonGlyph = Ti.UI.createImageView({
		backgroundImage: 'images/like-glyph.png',
		left: 118,
		bottom: 28,
		width: 28,
		height: 28,
		zIndex: 4
	});
		
	var likeLbl = Ti.UI.createLabel({
		left: 150, //84
		bottom: 28,
		text: L('Like'), 
		color: '#777777',
		font:{fontWeight:'bold',fontSize:18},		
		zIndex:4
	});

/*	
	var passButton = Ti.UI.createButton({
		backgroundImage: 'images/pass-button-inactive.png',
		backgroundSelectedImage: 'images/pass-button-active.png',
		bottom: 10,
		left: 161,
		width: 154,
		height: 57,
		zIndex: 3
	});
	
	var passLbl = Ti.UI.createLabel({
		left: 230,
		bottom: 30,
		text: L('Pass'), 
		color: '#777777',
		font:{fontWeight:'bold',fontSize:18},		
		zIndex:4
	});
*/

	if(_showButtons) {
		self.add(likeButton);
		self.add(buttonGlyph);
		self.add(likeLbl);
		
		//self.add(passButton);
		//self.add(passLbl);
	}
				
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.top = 254;
	self.add(pagingControl);
	
	scrollView.addEventListener('click', function() {
		var currentPage = scrollView.getCurrentPage();
		var ImageFullScreenWindowModule = require('ui/handheld/Mn_ImageFullScreenWindow');
		var imageFullScreenWindow = new ImageFullScreenWindowModule(_navGroup, imagesArray, currentPage); 
		_navGroup.open(imageFullScreenWindow, {animated: false});
	});
	
	self.setImage = function(_image, _imageIndex) {
		scrollView.views[_imageIndex].imgView.image = _image;
		imagesArray[_imageIndex] = _image; //for fullscreen image
	};
	
	var setSelectedState = function(_state) {
		if(_state === "like") {
			likeButton.backgroundImage = 'images/big-like-btn-disabled.png';
			buttonGlyph.width = 24;
			buttonGlyph.height = 21;
			buttonGlyph.backgroundImage = 'images/heart-glyph.png';
			likeLbl.text = L('Liked');
		}
		likeButton.enabled = false;
	};
	self.setSelectedState = setSelectedState;
	
	var clearState = function() {		
		likeButton.backgroundImage = 'images/big-like-btn.png';
		buttonGlyph.width = 28;
		buttonGlyph.height = 28;
		buttonGlyph.backgroundImage = 'images/like-glyph.png';
		likeLbl.text = L('Like');
		likeButton.enabled = true;
	};
	self.clearState = clearState;	
	
	likeButton.addEventListener("click", function() {
		if(!isActionTaken) { //add logic in case of delay...so we won't fire twice
			
			var currentCredit = CreditSystem.getUserCredit();
			if(currentCredit < 10 && Ti.App.CUSTOMER_TYPE === 'regular') {
				var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
					title: L('You have '+currentCredit+' credits left'),
					message: L('You need 10 credits to \'Like\' a person. Invite friends or buy more credits.'),
					buttonNames: [L('Ok')],
				});
				notEnoughCreditsDialog.show();
				Ti.App.NSAnalytics.trackEvent("Match","LikeMatch","Not enough credit",1);
			} else {
				//reach here only if, have more than 10 credits OR on the subscription plan			
				isActionTaken = true;
				setSelectedState("like");

				//save that the user like the person
				//alert to user
				var likeAlertView = Ti.UI.createView({
					borderRadius : 10,
					opacity : 0.8,
					top : 90,
					left : 50,
					right : 50,
					height : 115,
					zIndex : 7777,
					backgroundColor: '#000'
				});
				
				var alertLabel = Ti.UI.createLabel({
					text : L('You will be notified if your match likes you too'),
					textAlign : 'center',
					color : '#fff',
					zIndex : 9999,
					font : {
						fontSize : 16,
						fontWeight : 'bold'
					},
					top : 40
				});
				likeAlertView.add(alertLabel);
				
				var animation = Titanium.UI.createAnimation({
					opacity: 0, 
					duration: 4500
				});
				
				var animationHandler = function() {
					self.remove(likeAlertView);
				};
				animation.addEventListener('complete',animationHandler);
				self.add(likeAlertView);
				likeAlertView.animate(animation);
				Ti.Media.vibrate();
				
				var matchResponseObj = {matchId: _matchId, userId: _userId, response:"like"};
				BackendMatch.saveResponse(matchResponseObj, function(e){
					if(e.success) {
						Ti.App.CUSTOMER_TYPE = e.content.customer_type;
						CreditSystem.setUserCredit(e.content.credit); //sync the credit
						Ti.App.NSAnalytics.trackEvent("Match","LikeMatch","like succeeded",10);
					} else {
						isActionTaken = false;
						
						//either no credits to use or NO longer has the subscription
						if(e.content !== undefined && e.content.customer_type !== undefined) 
							Ti.App.CUSTOMER_TYPE = e.content.customer_type;
							
						if(e.content !== undefined && e.content.credit !== undefined) {
							CreditSystem.setUserCredit(e.content.credit); //sync the credit
							
							var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
								title: L('You have '+e.content.credit+' credits left'),
								message: L('You need 10 credits to \'Like\' a person. Invite friends or buy more credits.'),
								buttonNames: [L('Ok')],
							});
							notEnoughCreditsDialog.show();
						}
						clearState();
						Ti.App.NSAnalytics.trackEvent("Match","LikeMatch","like failed (90% coz not enough credits)",1);
					}
				});
			}
		}
	});
	return self;
};

module.exports = ProfileImageView;