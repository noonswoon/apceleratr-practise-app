TutorialMainWindow = function(_navGroup) {
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
		
	var Tutorial2Module = require('ui/handheld/Mn_Tutorial2View');
	var tutorial2View = new Tutorial2Module();
	viewsForScrollView.push(tutorial2View);

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
		zIndex: 2
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
	
	var pagingControl = new CustomPagingControl(scrollView);
	pagingControl.bottom = 45;
	self.add(pagingControl); 
	self.add(scrollView);	
	
	doneButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true});
	});
	
	return self;
};

module.exports = TutorialMainWindow;

