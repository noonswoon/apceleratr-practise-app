MyProfileWindow = function(_navGroup, _userId) {

	var BackendUser = require('backend_libs/backendUser');
	var CacheHelper = require('internal_libs/cacheHelper');

	var EditProfileWindowModule = require('ui/handheld/Mn_EditProfileWindow');
	var ProfileImageViewModule = require('ui/handheld/Mn_ProfileImageView');	
	var TextFieldDisplayTableViewRow = require('ui/handheld/Mn_TextFieldDisplayTableViewRow');
	var TextAreaDisplayTableViewRow = require('ui/handheld/Mn_TextAreaDisplayTableViewRow');	
	
	var userInfo = null;
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		title: 'My Profile',
		navBarHidden: false,
	});
	
	var contentView = Ti.UI.createTableView({
		backgroundColor:'white',
		separatorColor: 'transparent',
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var editBtn = Ti.UI.createButton({
		title: 'Edit', 
		height: 40, 
		width: 250, 
		left: 40,
	});
						
	var data = [];
	
	var profileImageView = null;

	function populateInfoDataTableView(_userInfo) {
		userInfo = _userInfo;
			
		data = []; //reset table data
		
		//profile image section
		profileImageView = new ProfileImageViewModule(_navGroup, userInfo.content.pictures);
		var profileImageRow = Ti.UI.createTableViewRow({
								infoType: 'image',
								backgroundColor:'#ffffff',
								backgroundSelectedColor:'#dddddd'
							});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		profileImageRow.add(profileImageView);
		data.push(profileImageRow);
		
		//GENERAL SECTION
		var generalSection = Ti.UI.createTableViewSection({headerTitle:'General Info'});	
		
		var nameTableViewRow = new TextFieldDisplayTableViewRow('name','Name', userInfo.content['general'].first_name+" "+userInfo.content['general'].last_name);
		generalSection.add(nameTableViewRow);
		
		var ageTableViewRow = new TextFieldDisplayTableViewRow('age','Age', userInfo.content['general'].age);
		generalSection.add(ageTableViewRow);
		
		var zodiacTableViewRow = new TextFieldDisplayTableViewRow('zodiac','Zodiac', userInfo.content['general'].zodiac);
		generalSection.add(zodiacTableViewRow);
		
		var heightTableViewRow = new TextFieldDisplayTableViewRow('height','Height (cm)', userInfo.content['height']);
		generalSection.add(heightTableViewRow); //require
	
		var ethnicityTableViewRow = new TextFieldDisplayTableViewRow('ethnicity','Ethnicity', userInfo.content['ethnicity']);
		generalSection.add(ethnicityTableViewRow); //require
		
		var religionTableViewRow = new TextFieldDisplayTableViewRow('religion','Religion', userInfo.content['religion']);
		generalSection.add(religionTableViewRow);
		
		var occupationTableViewRow = new TextFieldDisplayTableViewRow('occupation','Occupation', userInfo.content['work'].occupation);
		generalSection.add(occupationTableViewRow);
		
		var employerTableViewRow = new TextFieldDisplayTableViewRow('employer','Employer', userInfo.content['work'].employer);
		generalSection.add(employerTableViewRow);
		data.push(generalSection);
	
		//EDUCATION SECTION
		var educationSection = Ti.UI.createTableViewSection({headerTitle:'Education'});	
		for(var i = 0; i < userInfo.content.educations.length; i++) {
			var curEd = userInfo.content.educations[i]; 
			var desc = "";
			if(curEd.level === "high_school") desc = "High School";
			else if(curEd.level === "college") desc = "Bachelor";
			else desc = "Master/PhD";
			
			if(curEd.name !== "") {
				var educationTableViewRow = new TextFieldDisplayTableViewRow(curEd.level, desc, curEd.name);	
				educationSection.add(educationTableViewRow);
			}
		}
		data.push(educationSection);
	
		//ABOUTME SECTION	
		var aboutMeSection = Ti.UI.createTableViewSection({headerTitle:'About Me'});	
		var aboutMeTableViewRow = new TextAreaDisplayTableViewRow('about_me','', userInfo.content['about_me']);
		aboutMeSection.add(aboutMeTableViewRow);
		data.push(aboutMeSection);

		//INTERESTING FACTS
		var funFactsSection = Ti.UI.createTableViewSection({headerTitle:'Fun Facts'});	

		var genderCentricTableViewRow = new TextAreaDisplayTableViewRow('gender_centric','', 'Your friends are '+userInfo.content['gender_centric'].female+' girls and ' + userInfo.content['gender_centric'].male + ' guys');
		funFactsSection.add(genderCentricTableViewRow);

		var globalStatusTableViewRow = new TextAreaDisplayTableViewRow('global_status','', 'Your friendship spans in '+userInfo.content['global_status']+' countries');
		funFactsSection.add(globalStatusTableViewRow);
				
		var socialScoreTableViewRow = new TextAreaDisplayTableViewRow('social_score','', 'Based on your social media activity, your socialized score is '+userInfo.content['social_activity']+'%');
		funFactsSection.add(socialScoreTableViewRow);

		//Edit Button					
		var editBtnTableViewRow = Ti.UI.createTableViewRow({
			backgroundColor:'#fff',
			height: Ti.UI.FILL
		});
		if(Ti.Platform.osname === 'iphone')
			editBtnTableViewRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

		editBtnTableViewRow.add(editBtn);
		
		funFactsSection.add(editBtnTableViewRow);		
		data.push(funFactsSection);
		
		//SETTING DATA
		contentView.setData(data);
	}
	
	BackendUser.getUserInfo(_userId, function(_userInfo) {
		populateInfoDataTableView(_userInfo);
	});	

	editBtn.addEventListener('click', function() {
		var editProfileWindow = new EditProfileWindowModule(_navGroup, _userId, false);
		_navGroup.open(editProfileWindow);
	});
	
	Ti.App.addEventListener('editProfileSuccess', function(e) {
		Ti.API.info('editProfileSuccess: '+JSON.stringify(e));
		
		populateInfoDataTableView(e.editProfile);
		
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
	});

	self.add(contentView);
	return self;
};

module.exports = MyProfileWindow;

