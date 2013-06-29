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
		backgroundImage: 'images/like-button-inactive.png',
		backgroundSelectedImage: 'images/like-button-active.png',
		bottom: 10,
		left: 7,
		width: 154,
		height: 57,
		zIndex: 3
	});
	
	var likeLbl = Ti.UI.createLabel({
		left: 84,
		bottom: 30,
		text: L('Like'), 
		color: '#777777',
		font:{fontWeight:'bold',fontSize:18},		
		zIndex:4
	});
	
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

	if(_showButtons) {
		self.add(likeButton);
		self.add(passButton);
		self.add(likeLbl);
		self.add(passLbl);
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
		var textOnImageLbl = Ti.UI.createLabel({
			center: {x:'50%', y:'75%'},
			color: '#f1f2f3',
			font:{fontWeight:'bold',fontSize:24},		
			zIndex:4
		});
		
		var notificationImageUrl = "";
		if(_state === "like") {
			likeButton.backgroundImage = 'images/like-button-active.png';
			notificationImageUrl = 'images/notification-liked.png';
			textOnImageLbl.text = L("Liked");
		} else {
			passButton.backgroundImage = 'images/pass-button-active.png';
			notificationImageUrl = 'images/notification-passed.png';
			textOnImageLbl.text = L("Passed");
		}
		
		var notificationImage = Ti.UI.createImageView({
			image: notificationImageUrl,
			width: 145,
			height: 147,
			top: 58,
			left: 90,
			zIndex: 2
		});
		notificationImage.add(textOnImageLbl);
		
		self.add(notificationImage);
		likeButton.enabled = false;
		passButton.enabled = false;
	};
	self.setSelectedState = setSelectedState;
	
	likeButton.addEventListener("click", function() {
		if(!isActionTaken) { //add logic in case of delay...so we won't fire twice
			isActionTaken = true;
			
			var currentCredit = CreditSystem.getUserCredit();
			if(currentCredit < 10) {
				var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
					title: L('Not enough credits'),
					message: L('You need 10 credits to \'Like\' a person. Invite more friends to get more credits')
				});
				notEnoughCreditsDialog.show();
			} else {				
				//save that the user like the person
				var matchResponseObj = {matchId: _matchId, userId: _userId, response:"like"};
				BackendMatch.saveResponse(matchResponseObj, function(e){
					if(e.success)
						CreditSystem.setUserCredit(e.content.credit); //sync the credit
					else {
						var networkErrorDialog = Titanium.UI.createAlertDialog({
							title: L('Oops!'),
							message:L('There is something wrong. Please close and open Noonswoon again.'),
							buttonNames: [L('Ok')],
							cancel: 0
						});
						networkErrorDialog.show();	
					}
				});
				setSelectedState("like");
			}
		}
	});

	var passWarningDialog = Titanium.UI.createAlertDialog({
		title: L('You are Passing'),
		message:L('Are you sure you want to pass?'),
		buttonNames: [L('Cancel'),L('Pass')],
		cancel: 0
	});
	
	passWarningDialog.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'android' && mutualFriendsDialog.buttonNames === null) {
			Ti.API.info('(There was no button to click)');
		} else {
			if(e.index === 1) {
				if(!isActionTaken) { //add logic in case of delay...so we won't fire twice
					isActionTaken = true;
					setSelectedState("pass");
			
					var matchResponseObj = {matchId: _matchId, userId: _userId, response:"pass"};		
					BackendMatch.saveResponse(matchResponseObj, function(e){
						if(e.success)
							CreditSystem.setUserCredit(e.content.credit); //sync the credit
						else {
							var networkErrorDialog = Titanium.UI.createAlertDialog({
								title: L('Oops!'),
								message:L('There is something wrong. Please close and open Noonswoon again.'),
								buttonNames: [L('Ok')],
								cancel: 0
							});
							networkErrorDialog.show();	
						}
					});
				}
			}
		}
	});		
	
	passButton.addEventListener("click", function() {
		passWarningDialog.show();
	});	

	return self;
};

module.exports = ProfileImageView;