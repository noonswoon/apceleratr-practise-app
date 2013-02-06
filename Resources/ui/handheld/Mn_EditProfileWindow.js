EditInfoWindow = function(_navGroup, _userId, _newUser) {
	
	Ti.API.info('editInfo userId: '+ _userId);
	
	var FbPhotoAlbumWindowModule = require('ui/handheld/Mn_FbPhotoAlbumWindow');
	var PhotoEditTableViewRow = require('ui/handheld/Mn_PhotoEditTableViewRow');
	var TextFieldEditTableViewRow = require('ui/handheld/Mn_TextFieldEditTableViewRow');
	var EducationEditTableViewRow = require('ui/handheld/Mn_EducationEditTableViewRow');
	var PickerEditTableViewRow = require('ui/handheld/Mn_PickerEditTableViewRow');
	var AboutMeEditTableViewRow = require('ui/handheld/Mn_AboutMeEditTableViewRow');
	var EmptyTableViewRow = require('ui/handheld/Mn_EmptyTableViewRow');
	
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
	
	var heightArray = [];
	for(var i = 140; i <= 220; i++) {
		heightArray.push(i + ' cm'); //extensible for feet/inch here..just get a new array
	}
			
	//create component instance
	var photoSelectedOrder = -1; //for deciding which image to update
	var data = [];
	
	var cancelButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/edit/topbar-glyph-cancel.png',
	});
	
	var saveButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		font:{fontSize:14,fontWeight:'bold'},
		title:'Save',
		width:64,
		height:30,
	});
		
	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		navBarHidden: false,
		title: 'Edit Profile',
		barImage: 'images/top-bar-stretchable.png',
		leftNavButton: cancelButton,
		rightNavButton: saveButton
	});
	
	var editTableView = Ti.UI.createTableView({
		backgroundColor:'white',
		separatorColor: 'transparent',
	});

	var photoEditTableViewRow = null;
		
	self.add(editTableView);
		
	function populateInfoDataTableView(_userInfo) {
		if(Ti.Platform.osname === 'iphone')
			editTableView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

		//PHOTO SECTION
		photoEditTableViewRow = new PhotoEditTableViewRow([]); //setup the location, but content empty for now..setting up in function onInitialLoadProfileImageComplete
		data.push(photoEditTableViewRow);
		
		//GENERAL SECTION
		var generalSection = Ti.UI.createTableViewSection({headerTitle:'General Info'});	
		
		var heightTableViewRow = new PickerEditTableViewRow('height', _userInfo.content['height'], self, heightArray);
		data.push(heightTableViewRow); //require
		
		var ethnicityTableViewRow = new PickerEditTableViewRow('ethnicity', _userInfo.content['ethnicity'], self, ethnicityValue);
		data.push(ethnicityTableViewRow); //require
		
		var religionTableViewRow = new PickerEditTableViewRow('religion', _userInfo.content['religion'], self, religionValue);
		data.push(religionTableViewRow);
		
		var occupationTableViewRow = new TextFieldEditTableViewRow('occupation', _userInfo.content['work'].occupation);
		data.push(occupationTableViewRow);
		
		var employerTableViewRow = new TextFieldEditTableViewRow('employer', _userInfo.content['work'].employer);
		data.push(employerTableViewRow);
	
		//EDUCATION SECTION
		var educationTableViewRow = new EducationEditTableViewRow(_userInfo.content.educations);
		data.push(educationTableViewRow);

		//ABOUTME SECTION	
		var aboutMeTableViewRow = new AboutMeEditTableViewRow(_userInfo.content['about_me']);
		data.push(aboutMeTableViewRow);

		var edgeGradientTableViewRow = Ti.UI.createTableViewRow({
			top: 0,
			left: 0,
			width: '100%',
			height: 5,
			backgroundImage: 'images/match-bottom.png'
		});
		if(Ti.Platform.osname === 'iphone')
			edgeGradientTableViewRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		data.push(edgeGradientTableViewRow); 
		
		var emptyTableViewRow = new EmptyTableViewRow(); 
		data.push(emptyTableViewRow);
		
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
					photoEditTableViewRow.setImage(galleryImage, photoSelectedOrder, true);
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
					photoEditTableViewRow.setImage(cameraImage, photoSelectedOrder, true);	
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
			
			//close loading screen
			hidePreloader(self);
			
			var fbPhotoAlbumWindow = new FbPhotoAlbumWindowModule(_navGroup);
			_navGroup.open(fbPhotoAlbumWindow);	
		}
	});
	
	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
	// add event listener
	dialog.addEventListener('click',function(e)	{
		if(e.index == 0) { //facebook
			showPreloader(self,'Loading...');
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
		var loadedImageFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename).read(); //read() turns it into blob -- consistent with Gallery and Camera
		photoEditTableViewRow.setImage(loadedImageFile, photoSelectedOrder, true);	
		//saveBtn.enabled = true;
	}

	function onProfileImageProgress(progress){
	    Ti.API.info("progress being made " + progress);
	}	
	
	var selectedFbPhotoCallback = function(_photoSelectedEvent) {
		Ti.API.info('listening to selectedFbPhoto event'+ _photoSelectedEvent.photoId); 
		Titanium.Facebook.requestWithGraphPath(_photoSelectedEvent.photoId, {fields: 'id,source'}, 'GET', function(e) {
 			var graphObj = JSON.parse(e.result);
 			//saveBtn.enabled = false;
 			get_remote_file(Ti.Facebook.getUid()+"_"+_photoSelectedEvent.photoId+".jpg", graphObj.source, true, onProfileImageError, onProfileImageProgress, onProfileImageComplete)
 		});
	};

	function IsNumeric(input) {
	    return (input - 0) == input && input.length > 0;
	}
	
	var unsavedWarningDialog = Titanium.UI.createAlertDialog({
		title:'Profile is not saved.',
		message:'You will lose your unsaved data.',
		buttonNames: ['Cancel','Continue'],
		cancel: 0
	});
	
	unsavedWarningDialog.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'android' && mutualFriendsDialog.buttonNames === null) {
			Ti.API.info('(There was no button to click)');
		} else {
			if(e.index === 1) {
				_navGroup.close(self, {animated:true}); //go to the main screen
			}
		}
	});		
	
	cancelButton.addEventListener('click', function() {
		unsavedWarningDialog.show();	
	});
	
	saveButton.addEventListener('click', function() {		
		var editParams = {}; 
		var okToSave = true; 
		var heightWarning = false;
		
		//when click save, go through each image and element in the table
		//see which one is modified, build the content to send to the server
		//profile image and height must be present
		
		//images
		var imagesArray = photoEditTableViewRow.getImages();
		for(var i = 0; i < imagesArray.length; i++) {
			Ti.API.info('image modified: '+imagesArray[i].modified);
			if(imagesArray[i].modified) {
				Ti.API.info('found modified image at '+imagesArray[i].name);
				editParams[imagesArray[i].name] = imagesArray[i].src;
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
		        
		        if(row.getFieldName() === 'height' && !IsNumeric(row.getContent())) {
		        	row.highlightBorder();
		        	okToSave = false;
		        	heightWarning = true;
		        }
		        
		        if(row.getModified()) {
		        	if(row.getFieldName() !== 'education') {
			        	Ti.API.info('found modified content: '+row.getFieldName()+', value: '+row.getContent());
			        	editParams[row.getFieldName()] =  row.getContent();
		        	} else { //special case for education
		        		editParams['grad_school'] =  row.getContent()['graduate_school']; //TODO: will fix this to graduate_school once Amm changed it!
		        		editParams['college'] =  row.getContent()['college'];
		        		editParams['high_school'] =  row.getContent()['high_school'];	
		        	}
		        }
		    }
		}
		
		if(okToSave) {
			if(Ti.Platform.osname === 'iphone')
				showPreloader(self,'Loading...');
			BackendUser.saveEditUserInfo(_userId, editParams, function(_resultObj) {
				//use the result to send to the InfoPage
				if(_resultObj.success) {
					/*
					var successDialog = Titanium.UI.createAlertDialog({
							title:L('Thank you!'),
							message:L('Your information is saved.')
						});
					successDialog.show();
					*/
					//if(true) {
					if(_newUser) {
						var OnBoardingStep2Module = require('ui/handheld/Mn_OnBoardingStep2Window');
						var onBoardingStep2Window = new OnBoardingStep2Module(_navGroup, _userId);
						_navGroup.open(onBoardingStep2Window);
					} else {
						//convert photo to encoded64 for firing the event
						Ti.API.info('editInfo before firing: '+JSON.stringify(_resultObj));
						Ti.App.fireEvent('editProfileSuccess', {editProfile: _resultObj});
						_navGroup.close(self,{animated:true});
					}
				}
				
				if(Ti.Platform.osname === 'iphone') {
					hidePreloader(self);
				}
			});
		} else {
			var warningTitle = L('Missing information');
			var warningMsg = L('Please specify your height, ethnicity, and religion. It only takes 2 seconds.');
			if(heightWarning) {
				warningTitle = L('Height must be a number');
				warningMsg = L('Please re-enter your height again.');
			}
			var warningDialog = Titanium.UI.createAlertDialog({
						title:warningTitle,
						message:warningMsg
					});
			warningDialog.show();
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
	
	function onInitialLoadProfileImageComplete(filename) {
		var orderPic = parseInt((filename.split('.')[0]).slice(-1));
		var loadedImageFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename).read(); //read() turns it into blob -- consistent with Gallery and Camera
		photoEditTableViewRow.setImage(loadedImageFile, orderPic, false);	
		//saveBtn.enabled = true;
	}
		
	BackendUser.getUserInfo(_userId, function(_userInfo) {
		for(var i = 0; i < _userInfo.content.pictures.length; i++) {
			if(_userInfo.content.pictures[i].src !== "") {
				get_remote_file('profile'+i+'.jpg', _userInfo.content.pictures[i].src, true, onProfileImageError, onProfileImageProgress, onInitialLoadProfileImageComplete);
			}
		}
		populateInfoDataTableView(_userInfo);
	});

	return self;
};

module.exports = EditInfoWindow;

