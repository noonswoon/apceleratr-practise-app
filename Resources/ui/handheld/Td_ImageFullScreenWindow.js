var ImageFullScreenWindow = function(_navGroup, _imagesArray) {
		
	//UI STUFF
	var self = Ti.UI.createWindow({
					navBarHidden: true,
					tabBarHidden: true
				});

	var closeBtn = Ti.UI.createButton({
					title: 'Done',
					width: 80,
					height: 30,
					zIndex: 5,
					top: 20, 
					right: 40
				});
	var viewsForScrollView = [];

	for(var i = 0; i < _imagesArray.length; i++) {
		var imgView = Titanium.UI.createImageView({
			image:_imagesArray[i],
			width:'auto',
			height:'auto',
		});
		var view = Ti.UI.createView({
			backgroundColor:'black',
			width:'auto',
			height:'auto',
		});
		view.add(imgView);
		
		viewsForScrollView.push(view);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		showPagingControl:true,
		pagingControlHeight:30,
		maxZoomScale:2.0,
		currentPage:0,
		zIndex:1
	});
	
	closeBtn.addEventListener('click', function() {
		_navGroup.close(self, {animated: false});
	});
	
	self.add(closeBtn);
	self.add(scrollView);
	
	return self;
};

module.exports = ImageFullScreenWindow;