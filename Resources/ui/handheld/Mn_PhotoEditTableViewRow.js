PhotoEditTableViewRow = function(_imagesArray) {
	//imagesArray = [{name:'photo0', src:OBJECT, modified:false},{name:'photo1', src:OBJECT, modified:false} ]

	var imageDisplayViewArray = [];
	var imagesArray = _imagesArray;
	
	var tableRow = Ti.UI.createTableViewRow({
		className: "grid",
		layout: "horizontal",
		width: '100%',
		height: 130,
		backgroundImage: 'images/edit/edit-photos-background.png'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var numImages = imagesArray.length;

	var numImages = imagesArray.length;
	for(var i = numImages; i < 3; i++) {
		var defaultProfile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/edit/profile-picture-add.png');
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
		blob = blob.imageAsThumbnail(94);
		
		
		var imageCountView = Ti.UI.createImageView({
			image: 'images/edit/profile-picture-count.png',
			top: 15, 
			left: 6, 
			width: 21, 
			height: 22,	
			zIndex: 2
		});
		
		var imageCountLabel = Ti.UI.createLabel({
			text: (i+1),
			center: {x:'52%', y:'49%'},
			color:'#ffffff',
			shadowColor: '#6e060d', 
			shadowOffset: 2,
			font:{fontWeight:'bold',fontSize:14},
		});
		imageCountView.add(imageCountLabel); 

		var imageDisplayView = Ti.UI.createImageView({
			top: 18,
			left: 10,
			width: 94,
			height: 94,
			image: blob,
			zIndex: 1
		});
		
		var editStripImage = Ti.UI.createImageView({
			image: 'images/edit/edit-box.png',
			bottom: 0,
			left: 0,
			width: 94, 
			height: 16,
			zIndex: 2
		});

		var editLabel = Ti.UI.createLabel({
			text: 'edit',
			center: {x:'50%', y:'50%'},
			color:'#ffffff',
			zIndex: 3,
			shadowColor: '#4c3932', 
			shadowOffset: 2,
			font:{fontWeight:'bold',fontSize:14},
		});
		editStripImage.add(editLabel);
		imageDisplayView.add(editStripImage);
		
		var placeholderView = Ti.UI.createView({
			top: 0,
			left: 0,
			width: 103,
			height: 130,
			backgroundColor: '#transparent',
		});
		
		imageDisplayViewArray.push(imageDisplayView);
		
		(function() { //double binding, change execution context
			var photoSelectedOrder = i;
			imageDisplayView.addEventListener('click', function() {
				Ti.API.info('firing event tab on image: '+photoSelectedOrder);
				Ti.App.fireEvent('openImageDialog', {photoSelectedOrder: photoSelectedOrder} ); 
			});
		})();
		
		placeholderView.add(imageCountView);
		placeholderView.add(imageDisplayView);
		
		tableRow.add(placeholderView);
	}

	tableRow.setImage = function(_image, _imageIndex, _isModified) {
		//Displaying stuff
		var dummyImageView = Ti.UI.createImageView({
			image: _image,
		});
		var blob = dummyImageView.toImage();			 
		blob = blob.imageAsThumbnail(94);
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
	return tableRow;	
}
module.exports = PhotoEditTableViewRow;