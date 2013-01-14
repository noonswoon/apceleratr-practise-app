PhotoEditTableViewRow = function(imagesArray) {
	
	var imageDisplayViewArray = [];
	
	var tableRow = Ti.UI.createTableViewRow({
		className: "grid",
		layout: "horizontal",
		height: 105,
		backgroundColor:'#fff'
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		
			
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
	
	tableRow.setImage = function(_image, _order) {
		var dummyImageView = Ti.UI.createImageView({
			image: _image,
		});
		// Convert your imageView into a blob
		var blob = dummyImageView.toImage();			 
		// Turn blob into a square thumbnail
		blob = blob.imageAsThumbnail(100);
		
		imageDisplayViewArray[_order].image = blob;
	};
	
	tableRow.highlightBorder = function() { /* placeholder function */ };	
	tableRow.resetBorder = function() { /* placeholder function */ };		

	return tableRow;	
}
module.exports = PhotoEditTableViewRow;