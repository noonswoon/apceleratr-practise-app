UserProfileWindow = function(_navGroup, _userId, _targetedUserId) {
	
	Ti.App.GATracker.trackScreen("UserProfileScreen");
	
	var BackendUser = require('backend_libs/backendUser');
	var CacheHelper = require('internal_libs/cacheHelper');

	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var ProfileImageViewModule = require('ui/handheld/Mn_ProfileImageView');	

	var TextDisplayTableViewRow = require('ui/handheld/Mn_TextDisplayTableViewRow');
	var AboutMeTableViewRow = require('ui/handheld/Mn_AboutMeTableViewRow');
	var WorkTableViewRow = require('ui/handheld/Mn_WorkTableViewRow');	
	var EducationTableViewRow = require('ui/handheld/Mn_EducationTableViewRow');	
	var FbLikeTableViewRow = require('ui/handheld/Mn_FbLikeTableViewRow');
	var ReportProfileTableViewRow = require('ui/handheld/Mn_ReportProfileTableViewRow');	
	var FriendRatioTableViewRow = require('ui/handheld/Mn_FriendRatioTableViewRow');
	var ModelFacebookLike = require('model/facebookLike');

	var userInfo = null;
	//create component instance
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/edit/topbar-glyph-cancel.png',
	});
	
	var editButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		font:{fontSize:14,fontWeight:'bold'},
		title: L('Edit'),
		width:64,
		height:30,
	});
		
	var self = Ti.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		navBarHidden: false,
		leftNavButton: backButton
	});
	
	if(_userId === _targetedUserId) 
		self.rightNavButton = editButton;
	
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
		separatorColor: 'transparent',
		//width:'100%',
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var data = [];
	
	function educationCmpFn(a, b) {
		if(a.value < b.value) return -1; 
		else if(a.value > b.value) return 1;
		else return 0;
	}


	function populateInfoDataTableView(_userInfo) {		
		//Ti.API.info('_userInfo: '+JSON.stringify(_userInfo));

		if(_userId !== _targetedUserId) {
			var facebookLikeArray = [];
			for(var i = 0; i < _userInfo.content.likes.length; i++) {
				var likeObj = {
								'category': _userInfo.content.likes[i].category,
								'name': _userInfo.content.likes[i].name, 
								'is_mutual': _matchInfo.content.likes[i].is_mutual, 
							};
				facebookLikeArray.push(likeObj);
			}
			ModelFacebookLike.populateFacebookLike(_userId, _targetedUserId, facebookLikeArray);
		}
		
		data = []; //reset table data

		//profile image section
		//line below --> might have a race condition here if internet is super fast--navGroup will not be set
		var profileImageView = new ProfileImageViewModule(_navGroup, _userInfo.content.pictures, _targetedUserId, 0, false); 
		var profileImageRow = Ti.UI.createTableViewRow({backgroundColor:'transparent',backgroundSelectedColor:'transparent'});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		profileImageRow.add(profileImageView);
		data.push(profileImageRow);
		
		var friendRatioRow = new FriendRatioTableViewRow('gender_centric', {'female': _userInfo.content['gender_centric'].female, 'male': _userInfo.content['gender_centric'].male});
		data.push(friendRatioRow); 

		var whiteOrGrayFlag = true;
		//GENERAL SECTION
    	var	nameStr = _userInfo.content['general'].first_name; 
    	if(_userId === _targetedUserId) {
    		//nameStr += ' ' +  _userInfo.content['general'].last_name;		
    		self.title = L('My Profile');
    	} else {
    		self.title = _userInfo.content['general'].first_name + L('\'s Profile');
    	}
		var nameTableViewRow = new TextDisplayTableViewRow('name', nameStr, whiteOrGrayFlag);
		nameTableViewRow.getContentLabel().color = '#4e5866';
		data.push(nameTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		
		var ageTableViewRow = new TextDisplayTableViewRow('age', _userInfo.content['general'].age + ' '+ L('years old'), whiteOrGrayFlag);
		data.push(ageTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		
		var zodiacTableViewRow = new TextDisplayTableViewRow('zodiac', _userInfo.content['general'].zodiac, whiteOrGrayFlag);
		data.push(zodiacTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		
		
		if(_userInfo.content['general'].city !== "" || _userInfo.content['general'].country !== "") {
			var locationTableViewRow = new TextDisplayTableViewRow('location', {'city':_userInfo.content['general'].city, 'country':_userInfo.content['general'].country}, whiteOrGrayFlag);
			data.push(locationTableViewRow);		
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_userInfo.content['height'] !== "" ) {
			var heightTableViewRow = new TextDisplayTableViewRow('height', _userInfo.content['height'] + ' '+ L('cm'), whiteOrGrayFlag);
			data.push(heightTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_userInfo.content['ethnicity'] !== "" ) {
			var ethnicityTableViewRow = new TextDisplayTableViewRow('ethnicity', _userInfo.content['ethnicity'], whiteOrGrayFlag);
			data.push(ethnicityTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_userInfo.content['religion'] !== "" ) {	
			var religionTableViewRow = new TextDisplayTableViewRow('religion', _userInfo.content['religion'], whiteOrGrayFlag);
			data.push(religionTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_userInfo.content['work'].employer !== "" || _userInfo.content['work'].occupation !== "") {		
			var workTableViewRow = new WorkTableViewRow('work', _userInfo.content['work'].employer, _userInfo.content['work'].occupation, whiteOrGrayFlag);
			data.push(workTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		var educationArray = [];
		for(var i = 0; i < _userInfo.content.educations.length; i++) {
			var curEd = _userInfo.content.educations[i]; 
			//Ti.API.info('curEd: '+JSON.stringify(curEd));
			if(curEd.name !== '') {
				var eduObj = {'level': curEd.level, 'name': curEd.name};
				if(curEd.level === "graduate_school") eduObj.value = 0; //for comparison
				else if(curEd.level === "college") eduObj.value = 1;
				else eduObj.value = 2;
				educationArray.push(eduObj);
			}
		}
		educationArray.sort(educationCmpFn);
		
		if(educationArray.length > 0) {
			var educationTableViewRow = new EducationTableViewRow('education', educationArray, whiteOrGrayFlag);
			data.push(educationTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}

		//ABOUTME SECTION	
		if(_userInfo.content['about_me'] !== "" ) {	
			var aboutMeTableViewRow = new AboutMeTableViewRow('about_me', _userInfo.content['about_me'], whiteOrGrayFlag);
			data.push(aboutMeTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		var fbLikeCollection = ModelFacebookLike.getAllFacebookLike(_targetedUserId);
		if(fbLikeCollection.length > 0) {
			var fbLikeTableViewRow = new FbLikeTableViewRow('fb_like', fbLikeCollection, whiteOrGrayFlag);
			data.push(fbLikeTableViewRow);
		}
		
		var edgeGradientTableViewRow = Ti.UI.createTableViewRow({
			top: 0,
			left: 0,
			width: '100%',
			height: 5,
			backgroundImage: 'images/row-bottom-edge.png'
		});
		if(Ti.Platform.osname === 'iphone')
			edgeGradientTableViewRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		data.push(edgeGradientTableViewRow); 

		if(_userId !== _targetedUserId) {
			var reportProfileTableViewRow = new ReportProfileTableViewRow('report_profile'); 
			data.push(reportProfileTableViewRow);
		}

		contentView.data = data;
		self.add(contentView);
	}	

	showPreloader(self, L('Loading...'));
	BackendUser.getUserInfo(_targetedUserId, function(_userInfo) {
		if(_userInfo.success) {
			populateInfoDataTableView(_userInfo);
		}
		hidePreloader(self);
	});	

	editButton.addEventListener('click', function() {
		Ti.API.info('edit profile screen');
		var editProfileWindow = new EditProfileWindowModule(_navGroup, _userId, false);
		_navGroup.open(editProfileWindow, {animated: true});
	});
	
	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	var editProfileSuccessCallback = function(e) {
		//Ti.API.info('editProfileSuccess: '+JSON.stringify(e));
		populateInfoDataTableView(e.editProfile);
	};
	
	Ti.App.addEventListener('editProfileSuccess', editProfileSuccessCallback);
	
	var windowCloseCallback = function() {
		Ti.App.removeEventListener('editProfileSuccess', editProfileSuccessCallback);
	};

	self.addEventListener('close', windowCloseCallback);
	
	self.add(contentView);
	return self;
};

module.exports = UserProfileWindow;

/*
		 * sample code
		 for(var prop in e.editInfo) {
			if(prop.indexOf('photo') !== -1) {
				var imageIndex = parseInt(prop.charAt(prop.length - 1));
				var imageFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,e.editInfo[prop])
				profileImageView.setImage(imageFile, imageIndex);
			
				//need to update userInfo as well
			} else {
				Ti.API.info('prop to update: '+prop);
				//iterate table for each field
				var sections = contentView.data;
				for(var i = 0; i < sections.length; i++) {
				    var section = sections[i];
				    for(var j = 0; j < section.rowCount; j++) {
				        var row = section.rows[j];
				        //Ti.API.info('row.infoType: '+ JSON.stringify(row));      
				        if(row.getFieldName() === prop) {
				        	row.setContent(e.editInfo[prop]);	
				        }
				    }
				}
			}	
    	}	
    	*/