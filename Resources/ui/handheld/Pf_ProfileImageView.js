ProfileImageView = function(_rootWindow, _pictures) {
	//create component instance
	var profileImageView = Ti.UI.createView({
		backgroundColor:'#797C7E',
		width:'100%',
		height:220,
		top:0,
	});
	
	var viewsForScrollView = [];
	var imagesArray = [];
	
	var view = null;
	for(var i = 0; i < _pictures.length; i++) {
		var img = _pictures[i].src; //Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/'+ _pictures[i].src);
		imagesArray.push(img);
		var imgView = Titanium.UI.createImageView({
			image:img,
			width:'auto',
			height:220,
		});
		view = Ti.UI.createView({
			backgroundColor:'black',
			width:'auto',
			height:220,
			imgView: imgView
		});
		view.add(imgView);
		
		viewsForScrollView.push(view);
	}
	
	var scrollView = Titanium.UI.createScrollableView({
		views:viewsForScrollView,
		showPagingControl:true,
		pagingControlHeight:30,
		maxZoomScale:2.0,
		currentPage:0
	});
	profileImageView.add(scrollView);
	
	scrollView.addEventListener('click', function() {
		Ti.API.info('click event');
		var ImageFullScreenWindowModule = require('ui/common/Td_ImageFullScreenWindow');
		var imageFullScreenWindow = new ImageFullScreenWindowModule(imagesArray); 
		_rootWindow.containingTab.open(imageFullScreenWindow,{animated:true});
	});
	
	profileImageView.setImage = function(_image, _imageIndex) {
		scrollView.views[_imageIndex].imgView.image = _image;
		imagesArray[_imageIndex] = _image; //for fullscreen image
	};
	
	return profileImageView;
};

module.exports = ProfileImageView;