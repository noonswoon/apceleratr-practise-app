EditInfoWindow = function(_navGroup, _userId, _newUser) {

	var FbPhotoAlbumWindowModule = require('ui/handheld/Mn_FbPhotoAlbumWindow');
	var PhotoEditTableViewRow = require('ui/handheld/Mn_PhotoEditTableViewRow');
	var TextFieldEditTableViewRow = require('ui/handheld/Mn_TextFieldEditTableViewRow');
	var TextAreaEditTableViewRow = require('ui/handheld/Mn_TextAreaEditTableViewRow');
	var PickerEditTableViewRow = require('ui/handheld/Mn_PickerEditTableViewRow');
	
	var BackendUser = require('backend_libs/backendUser');
	
	var ModelEthnicity = require('model/ethnicity');
	var ModelReligion = require('model/religion');
	
	var ethnicityValue = ModelEthnicity.getEthnicity();
	ethnicityValue.reverse(); 
	ethnicityValue.push('Choose your ethnicity'); 
	ethnicityValue.reverse(); 
	
	var religionValue = ModelReligion.getReligion();
	religionValue.reverse(); 
	religionValue.push('Choose your religion'); 
	religionValue.reverse(); 
			
	//create component instance
	var photoSelectedOrder = -1; //for deciding which image to update
	var imagesArray = [];
	var data = [];
	
	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		navBarHidden: false,
		title: 'Edit Profile'
	});
	
	var editTableView = Ti.UI.createTableView({
		backgroundColor:'white',
		separatorColor: 'transparent',
	});
	
	var saveBtn = Ti.UI.createButton({
		title: 'Save', 
		height: 40, 
		width: 250, 
		left: 40,
	});
		
	self.add(editTableView);
		
	function populateInfoDataTableView(_userInfo) {
		for(var i = 0; i < _userInfo.content.pictures.length; i++) {
			var nameStr = 'photo'+i;
			var photoObj = {name:nameStr, modified:false, src:_userInfo.content.pictures[i].src};
			imagesArray.push(photoObj);
		}
	
		if(Ti.Platform.osname === 'iphone')
			editTableView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		//PHOTO SECTION
		var photoSection = Ti.UI.createTableViewSection({headerTitle:'Photos'});	
		var photoEditTableViewRow = new PhotoEditTableViewRow(imagesArray);
		photoSection.add(photoEditTableViewRow);
		data.push(photoSection);
		
		//GENERAL SECTION
		var generalSection = Ti.UI.createTableViewSection({headerTitle:'General Info'});	
		
		var heightTableViewRow = new TextFieldEditTableViewRow('height','Height (cm)', _userInfo.content['height']);
		generalSection.add(heightTableViewRow); //require
	
		var ethnicityTableViewRow = new PickerEditTableViewRow('ethnicity','Ethnicity', _userInfo.content['ethnicity'], self, ethnicityValue);
		generalSection.add(ethnicityTableViewRow); //require
		
		var religionTableViewRow = new PickerEditTableViewRow('religion','Religion', _userInfo.content['religion'], self, religionValue);
		generalSection.add(religionTableViewRow);
		
		var occupationTableViewRow = new TextFieldEditTableViewRow('occupation','Occupation', _userInfo.content['work'].occupation);
		generalSection.add(occupationTableViewRow);
		
		var employerTableViewRow = new TextFieldEditTableViewRow('employer','Employer', _userInfo.content['work'].employer);
		generalSection.add(employerTableViewRow);
		data.push(generalSection);
	
		//EDUCATION SECTION
		var educationSection = Ti.UI.createTableViewSection({headerTitle:'Education'});	
		for(var i = 0; i < _userInfo.content.educations.length; i++) {
			var curEd = _userInfo.content.educations[i]; 
			var desc = "";
			if(curEd.level === "high_school") desc = "High School";
			else if(curEd.level === "college") desc = "Bachelor";
			else desc = "Master/PhD";
			
			var educationTableViewRow = new TextFieldEditTableViewRow(curEd.level, desc, curEd.name);	
			educationSection.add(educationTableViewRow);
		}
		data.push(educationSection);
	
		//ABOUTME SECTION	
		var aboutMeSection = Ti.UI.createTableViewSection({headerTitle:'About Me'});	
		var aboutMeTableViewRow = new TextAreaEditTableViewRow('about_me','', _userInfo.content['about_me']);
		aboutMeSection.add(aboutMeTableViewRow);
	
		var saveBtnTableViewRow = Ti.UI.createTableViewRow({
			backgroundColor:'#fff',
			height: Ti.UI.FILL
		});
		if(Ti.Platform.osname === 'iphone')
			saveBtnTableViewRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

		saveBtnTableViewRow.add(saveBtn);
		aboutMeSection.add(saveBtnTableViewRow);		
		data.push(aboutMeSection);
		
		//SETTING DATA
		editTableView.setData(data);
	}	
	
	var optionsDialogOpts = {
		options:['Choose from Facebook', 'Choose from Library', 'Take Photo', 'Cancel'],
		cancel:3
	};

	var openGallery = function() {
		Titanium.Media.openPhotoGallery({
			success:function(event) {
				//var cropRect = event.cropRect;
				var galleryImage = event.media;
		
				// set image view
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					photoEditTableViewRow.setImage(galleryImage, photoSelectedOrder);	
					imagesArray[photoSelectedOrder].src = galleryImage;
					Ti.API.info('gallery native path: '+galleryImage.nativePath);
					imagesArray[photoSelectedOrder].to_upload = galleryImage; //Ti.Utils.base64encode(galleryImage);
					
					//Debug.debug_log(Ti.Utils.base64encode(galleryImage));
					imagesArray[photoSelectedOrder].modified = true;
				}
				else {
					// is this necessary?
				}
				//Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);
		
			},
			cancel:function() { },
			error:function(error) { },
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
		});
	};
	
	var fireUpTheCamera = function() {
		Titanium.Media.showCamera({
			success:function(event) {
				//var cropRect = event.cropRect;
				var cameraImage = event.media;
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					photoEditTableViewRow.setImage(cameraImage, photoSelectedOrder);	
					imagesArray[photoSelectedOrder].src = cameraImage;
					imagesArray[photoSelectedOrder].to_upload = cameraImage; //Ti.Utils.base64encode(cameraImage);
					imagesArray[photoSelectedOrder].modified = true;
				} else {
					alert("got the wrong type back ="+event.mediaType);
				}
			},
			cancel:function() { },
			error:function(error) {
				// create alert
				var a = Titanium.UI.createAlertDialog({title:'Camera'});
		
				// set message
				if (error.code == Titanium.Media.NO_CAMERA) {
					a.setMessage('Please run this test on device');
				} else {
					a.setMessage('Unexpected error: ' + error.code);
				}
		
				// show alert
				a.show();
			},
			saveToPhotoGallery:true,
			allowEditing:true,
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
		});
	};

	function onThumbnailImageError(error) {
	    Ti.API.info("thumbnail error " + JSON.stringify(error));		
	}
	
	function onThumbnailImageComplete(filename){
		//Ti.API.info('complete loading file: '+JSON.stringify(file));
		Ti.API.info('thumbnail created filename: '+filename);
		Ti.App.fireEvent('thumbnailLoadedComplete');
	}

	function onThumbnailImageProgress(progress){
	    Ti.API.info("thumbnail progress being made " + progress);
	}	
		
	//create a directory inside applicationDataDirectory, fbPics directory
	var fbPicsFolder = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'fbPics');
	if( !fbPicsFolder.exists() ) {
		fbPicsFolder.createDirectory();
	}
					
	var numThumbnailsToWait = -1;
	
	Ti.App.addEventListener('thumbnailLoadedComplete', function(){
		numThumbnailsToWait--;	
		Ti.API.info('numThumbnailsToWait: '+numThumbnailsToWait);
		if(numThumbnailsToWait === 0) {
			var fbPhotoAlbumWindow = new FbPhotoAlbumWindowModule();
			_rootWindow.containingTab.open(fbPhotoAlbumWindow);	
		}
	});
	
	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
	// add event listener
	dialog.addEventListener('click',function(e)	{
		if(e.index == 0) { //facebook
			//get the facebook photos and build the facebook album here
			Titanium.Facebook.requestWithGraphPath('me/albums', {
            	fields : 'id, type'
	        }, 'GET', function(e) {
	            if(e.success) {
	                var profileAlbumId = 0;
	                if(e.result) {
	                    var albumData = JSON.parse(e.result).data;
	                    
	                    for(curAlbum in albumData) {
	                        if(albumData[curAlbum].type === 'profile') { 
	                        	profileAlbumId = albumData[curAlbum].id;
								Ti.API.info('**dummy**-found profile pic album: '+profileAlbumId);
	                        	break;
	                        }
	                    }

	                    //get images from the album
	                     Titanium.Facebook.requestWithGraphPath(profileAlbumId+'/photos', {
	                     	fields: 'id, picture, link'}, 'GET', function(e) {
	                     	if(e.result) {
	                     		var photoData = JSON.parse(e.result).data;
	                     		numThumbnailsToWait = photoData.length;
								for(var i=0;i < photoData.length; i++) {
									var photoObj = photoData[i];
									
									//saving facebook photo to iPhone
									get_remote_file('fbPics/fbPic_'+i+"_"+photoObj.id+".jpg", photoObj.picture, true, onThumbnailImageError, onThumbnailImageProgress, onThumbnailImageComplete);
								}
	                     	} else if(e.cancelled) {
				                Ti.API.debug("user cancelled");         		
	                     	} else {
	                     		Ti.API.debug(e.result);
	                     	}
	                     });
	                }
	            } else if(e.cancelled) {
	            	Ti.API.debug("user cancelled");
	            } else {
	                Ti.API.debug(e.result);
	            }
	        });
		} else if(e.index == 1) {
			openGallery();	
		} else if(e.index == 2) {
			fireUpTheCamera();		
		} else {
			Ti.API.info('cancel..');
		}
	});

	function onProfileImageError(error) {
	    Ti.API.info("error " + JSON.stringify(error));		
	}
	
	function onProfileImageComplete(filename){
		//Ti.API.info('complete loading file: '+JSON.stringify(file));
		Ti.API.info('created filename: '+filename);
		var loadedImageFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename).read(); //read() turns it into blob -- consistent with Gallery and Camera
		photoEditTableViewRow.setImage(loadedImageFile, photoSelectedOrder);	
		imagesArray[photoSelectedOrder].src = filename;
		imagesArray[photoSelectedOrder].to_upload = loadedImageFile; //Ti.Utils.base64encode(loadedImageFile);
		imagesArray[photoSelectedOrder].modified = true;
		saveBtn.enabled = true;
	}

	function onProfileImageProgress(progress){
	    Ti.API.info("progress being made " + progress);
	}	
	
	var selectedFbPhotoCallback = function(_photoSelectedEvent) {
		Ti.API.info('listening to selectedFbPhoto event'+ _photoSelectedEvent.photoId); 
		Titanium.Facebook.requestWithGraphPath(_photoSelectedEvent.photoId, {fields: 'id,source'}, 'GET', function(e) {
 			var graphObj = JSON.parse(e.result);
 			saveBtn.enabled = false;
 			get_remote_file(Ti.Facebook.getUid()+"_"+_photoSelectedEvent.photoId+".jpg", graphObj.source, true, onProfileImageError, onProfileImageProgress, onProfileImageComplete)
 		});
	};
	
	saveBtn.addEventListener('click', function() {
		//upload images and filled information
		//Ti.API.info('imagesArray: '+ JSON.stringify(imagesArray));
		//Ti.API.info(imagesArray[0].src);
		
		var editParams = {}; 
		var okToSave = true; 
		
		//when click save, go through each image and element in the table
		//see which one is modified, build the content to send to the server
		//profile image and height must be present
		
		//images
		for(var i = 0; i < imagesArray.length; i++) {
			Ti.API.info('image modified: '+imagesArray[i].modified);
			if(imagesArray[i].modified) {
				Ti.API.info('found modified image');
				editParams[imagesArray[i].name] = imagesArray[i].to_upload;
			}
		}
		
		//contents in the table
		var sections = editTableView.data;
		for(var i = 0; i < sections.length; i++) {
		    var section = sections[i];
		    for(var j = 0; j < section.rowCount; j++) {
		        var row = section.rows[j];
		        
		        if(row.getContent() === '' && (
		        	row.getFieldName() === 'height' ||
		        	row.getFieldName() === 'religion' ||
		        	row.getFieldName() === 'ethnicity')
		        ) {
		        	row.highlightBorder();
		        	okToSave = false;
		        }
		        
		        if(row.getModified()) {
		        	Ti.API.info('found modified content: '+row.getFieldName()+', value: '+row.getContent());
		        	editParams[row.getFieldName()] =  row.getContent();
		        }
		    }
		}
		if(Ti.Platform.osname === 'iphone')
			showPreloader(self,'Loading...');
		if(okToSave) {
			BackendUser.saveEditUserInfo(_userInfo.meta.user_id, editParams, function(_resultObj) {
				//use the result to send to the InfoPage
				if(_resultObj.success) {
					var successDialog = Titanium.UI.createAlertDialog({
							title:L('Thank you!'),
							message:L('Your information is saved.')
						});
					successDialog.show();
					if(_newUser) {
						var FriendViralWindowModule = require('ui/common/Am_FriendViralMainWindow');
						var friendViralWindow = new FriendViralWindowModule(_userInfo.meta.user_id);
						_rootWindow.containingTab.open(friendViralWindow);
					} else {
						//convert photo to encoded64 for firing the event
						Ti.API.info('editInfo before firing: '+JSON.stringify(_resultObj));
						Ti.App.fireEvent('editInfoSuccess', {editInfo: _resultObj});
						self.close({animated:true});
					}
				}
				
				if(Ti.Platform.osname === 'iphone') {
					hidePreloader(self);
				}
			});
		} else {
			var warningDialog = Titanium.UI.createAlertDialog({
						title:L('Missing information'),
						message:L('Please specify your height, ethnicity, and religion. It only takes 2 seconds.')
					});
			warningDialog.show();
			hidePreloader(self);
		}
	});
	
	Ti.App.addEventListener('selectedFbPhoto', selectedFbPhotoCallback);
	
	var openImageDialogCallback = function(e) {
		photoSelectedOrder = e.photoSelectedOrder;
		dialog.show();
	};
	Ti.App.addEventListener('openImageDialog', openImageDialogCallback);

	var windowCloseCallback = function() {
		Ti.API.info('EditInfoWindow close...');
		Ti.App.removeEventListener('selectedFbPhoto', selectedFbPhotoCallback);
		Ti.App.removeEventListener('openImageDialog', openImageDialogCallback);
		self.removeEventListener('close', windowCloseCallback);
	};	
	self.addEventListener('close', windowCloseCallback);

	BackendUser.getUserInfo(_userId, function(_userInfo) {
		Ti.API.info('getting userData for edit page: '+JSON.stringify(_userInfo));
		populateInfoDataTableView(_userInfo);
	});

	return self;
};

module.exports = EditInfoWindow;

