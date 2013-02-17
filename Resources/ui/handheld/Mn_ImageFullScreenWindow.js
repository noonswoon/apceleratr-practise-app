var ImageFullScreenWindow = function(_navGroup, _imagesArray, _currentPage) {
		
	//UI STUFF
	var self = Ti.UI.createWindow({
		navBarHidden: true,
		tabBarHidden: true
	});

	var doneBtnView = Ti.UI.createImageView({
		image: 'images/done-button.png',
		width: 52,
		height: 27,
		zIndex: 5,
		top: 15, 
		left: 253
	});
	
	var doneText = Ti.UI.createLabel({
		text: 'Done', 
		center: {x:'50%', y:'50%'},
		color: '#e6e6e6', 
		font:{fontWeight:'bold',fontSize:12},
	});
	doneBtnView.add(doneText);
	
	var viewsForScrollView = [];

	for(var i = 0; i < _imagesArray.length; i++) {
		var imgView = Titanium.UI.createImageView({
			image:_imagesArray[i],
			width: 320,
			height:'auto',
		});
		var view = Ti.UI.createView({
			backgroundColor:'black',
			width: '100%',
			height:'100%',
		});
		view.add(imgView);
		
		viewsForScrollView.push(view);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		top: 0,
		views:viewsForScrollView,
		showPagingControl:true,
		pagingControlHeight:20,
		currentPage:_currentPage,
		zIndex:1
	});
	
	doneBtnView.addEventListener('click', function() {
		_navGroup.close(self, {animated: false});
	});
	
	self.add(scrollView);
	self.add(doneBtnView);
		
	return self;
};
module.exports = ImageFullScreenWindow;