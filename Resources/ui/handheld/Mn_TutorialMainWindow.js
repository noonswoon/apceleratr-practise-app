TutorialMainWindow = function() {
	Ti.App.GATracker.trackScreen("TutorialScreen");
	var CustomPagingControl = require('external_libs/customPagingControl');

	var navGroup = null;
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: true,
		backgroundColor: 'black'
	});

	var iphone5Flag = false;
	if(Ti.Platform.displayCaps.platformHeight === 568) { //iphone 5
		iphone5Flag = true;
	}
	
	var viewsForScrollView = [];
	var view = null;

	var Tutorial1Module = require('ui/handheld/Mn_Tutorial1View');
	var tutorial1View = new Tutorial1Module();
	viewsForScrollView.push(tutorial1View);
		
/* -- no mutual friend
	var Tutorial2Module = require('ui/handheld/Mn_Tutorial2View');
	var tutorial2View = new Tutorial2Module();
	viewsForScrollView.push(tutorial2View);
*/

	var Tutorial3Module = require('ui/handheld/Mn_Tutorial3View');
	var tutorial3View = new Tutorial3Module();
	viewsForScrollView.push(tutorial3View);
		
	var Tutorial4Module = require('ui/handheld/Mn_Tutorial4View');
	var tutorial4View = new Tutorial4Module();
	viewsForScrollView.push(tutorial4View);
		
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		showPagingControl:false,
		currentPage:0,
		disableBounce: true,
		zIndex: 0,
	});
		
	var doneButton = Ti.UI.createButton({
		backgroundImage: 'images/credit/buy-button.png',
		backgroundSelectedImage: 'images/credit/buy-button-active.png',
		center: {x:'50%', y:'95%'},
		width: 57, 
		height: 28,
		zIndex: 2, 
		opacity: 0
	});
	
	var doneButtonText = Ti.UI.createLabel({
		text: L('Done'),
		color: '#636c77',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:14},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	doneButton.add(doneButtonText);	
	self.add(doneButton);

	var doneButtonVisible = false;
	var paginationUpAnimation = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
        bottom:45,
        duration:300
    }); 
    
	var paginationDownAnimation = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
        bottom:15,
        duration:500
    });
    
	var buttonInAnimation = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_IN,
        opacity:1,
        duration:500
    }); 
    
	var buttonOutAnimation = Titanium.UI.createAnimation({
        curve:Ti.UI.ANIMATION_CURVE_EASE_OUT,
        opacity:0,
        duration:200
    });     
	
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.bottom = 15;
	self.add(pagingControl); 
	self.add(scrollView);	
	
	scrollView.addEventListener('scrollend', function(e) {
		if(scrollView.currentPage === 2) {
			doneButton.animate(buttonInAnimation);
			pagingControl.animate(paginationUpAnimation);
			doneButtonVisible = true;
		} else {
			if(doneButtonVisible) {
				doneButtonVisible = false;
				doneButton.animate(buttonOutAnimation);
				pagingControl.animate(paginationDownAnimation);
			}
		}
	});
	
	doneButton.addEventListener('click', function() {
		self.close();
	});
	
	return self;
};

module.exports = TutorialMainWindow;

