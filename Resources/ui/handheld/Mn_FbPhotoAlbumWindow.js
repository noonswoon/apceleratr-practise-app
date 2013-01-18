FbPhotoAlbumWindow = function() {
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		navBarHidden: false,
		title: 'Facebook Photos'
	});
	   
    var tableview = Ti.UI.createTableView({
    	backgroundColor : 'transparent',
    	rowBackgroundColor : 'white',
    	separatorColor: 'transparent',
    });
	if(Ti.Platform.osname === 'iphone')
		tableview.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;    
       
    var activityIndicator = Ti.UI.createActivityIndicator({
    	message:' Loading...',
    });

	function filenameComparator(a, b) {
		var orderA = parseInt(a.split('_')[1]);
		var orderB = parseInt(b.split('_')[1]);	    	
		if(orderA < orderB) return -1;
		else if(orderA > orderB) return 1;
		else return 0;
	}

	var fbPicsFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'fbPics');
	var picFiles = fbPicsFolder.getDirectoryListing().toString();
	 
	var filesArray = picFiles.split(',');
	var picsArray = []; 
	for(var i = 0; i < filesArray.length; i++) {
		var curFile = filesArray[i];
		if(curFile.indexOf('fbPic') !== -1) //removing file .DS_Store
			picsArray.push(filesArray[i]);	
	}
	
	picsArray.sort(filenameComparator); 
	
	var tableData = [];
	var xGrid = 4;
	var yGrid = parseInt(picsArray.length / xGrid);
	
	var photoObj = null;
	for (var y = 0; y < yGrid; y++) {
		var thisRow = Ti.UI.createTableViewRow({
							className: "grid",
							layout: "horizontal",
							backgroundColor:"black",
						});
		if(Ti.Platform.osname === 'iphone')
			thisRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

		for(var x = 0; x < xGrid; x++) {
			var index = x + xGrid * y;			
			var curFbPic = picsArray[index];
			var fbPicId = curFbPic.split('_')[2].split('.')[0];
			var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'fbPics/'+curFbPic);
			var fbPhotoView = Ti.UI.createImageView({
								image: imageFile,
								});
										
			// Convert your imageView into a blob
			var blob = fbPhotoView.toImage().imageAsThumbnail(77);
									
			// Create new imageView for thumbnail
			var thumbnailImageView = Ti.UI.createImageView({
									image: blob,
									left: 0,
									top: 0,
								});
									
			//double binding - changing the execution context
			(function() {
				var photoId = fbPicId;
				thumbnailImageView.addEventListener('click', function() {
					Ti.API.info('firing event selectedFbPhoto');
					Ti.App.fireEvent('selectedFbPhoto', {photoId: photoId} ); 
					self.close({animated:true});
				});
			})();

			thisRow.add(thumbnailImageView);
		}
		tableData.push(thisRow);
	}
	tableview.data = tableData;

	self.add(tableview);

	return self;
};

module.exports = FbPhotoAlbumWindow;
