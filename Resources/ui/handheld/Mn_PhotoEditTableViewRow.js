PhotoEditTableViewRow = function(_imagesArray) {
	//imagesArray = [{name:'photo0', src:OBJECT, modified:false},{name:'photo1', src:OBJECT, modified:false} ]
	
	
	var imageDisplayViewArray = [];
	var imagesArray = _imagesArray;
	
	var tableRow = Ti.UI.createTableViewRow({
		className: "grid",
		layout: "horizontal",
		height: 105,
		backgroundColor:'#fff'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
	Ti.API.info('aaa');			
	var numImages = imagesArray.length;
	for(var i = numImages; i < 3; i++) {
		var defaultProfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/default_profile.png');
		var photoObj = {name:'photo'+i, modified:false, src:defaultProfile};
		imagesArray.push(photoObj);
	}
	
	for(var i = 0; i < imagesArray.length; i++) {
		
		
		var photoView = Ti.UI.createImageView({
			image: imagesArray[i].src,
		});
											
		// Convert your imageView into a blob
		var blob = photoView.toImage();
										 
		// Turn blob into a square thumbnail
		blob = blob.imageAsThumbnail(100);
	
		var imageDisplayView = Ti.UI.createImageView({
			left: 2,
			width: 100,
			height: 100,
			image: blob
		});	
		imageDisplayViewArray.push(imageDisplayView);
		
		(function() { //double binding, change execution context
			var photoSelectedOrder = i;
			imageDisplayView.addEventListener('click', function() {
				Ti.API.info('firing event tab on image: '+photoSelectedOrder);
				Ti.App.fireEvent('openImageDialog', {photoSelectedOrder: photoSelectedOrder} ); 
			});
		})();
		
		tableRow.add(imageDisplayView);
	}

	Ti.API.info('ccc');	
	tableRow.setImage = function(_image, _imageIndex, _isModified) {
		//Displaying stuff
		var dummyImageView = Ti.UI.createImageView({
			image: _image,
		});
		var blob = dummyImageView.toImage();			 
		blob = blob.imageAsThumbnail(100);
		imageDisplayViewArray[_imageIndex].image = blob;
		
		//content stuff
		imagesArray[_imageIndex].src = _image; //for fullscreen image/upload
		imagesArray[_imageIndex].modified = _isModified;
	};
	
	tableRow.getImages = function() {
		return imagesArray;
	};	
	
	
	tableRow.highlightBorder = function() { /* placeholder function */ };	
	tableRow.resetBorder = function() { /* placeholder function */ };		
	Ti.API.info('ddd');
	return tableRow;	
}
module.exports = PhotoEditTableViewRow;