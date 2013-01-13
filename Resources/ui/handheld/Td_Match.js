MatchWindow = function(_userId, _matchId) {
	var BackendMatch = require('backend_libs/backendMatch');
	var matchId = -1;
	var ProfileImageViewModule = require('ui/handheld/Pf_ProfileImageView');
	var TextDisplayTableViewRow = require('ui/handheld/Me_TextDisplayTableViewRow');
	var navGroup = null;
	
	//create component instance
	var self = Ti.UI.createWindow({
		left: 0,
		backgroundColor:'white',
		navBarHidden: false
	});
				
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'white',
		separatorColor: 'transparent',
		//width:'100%',
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
	var data = [];

	var likeBtn = Ti.UI.createButton({
		title: 'Like', 
		height: 40, 
		width: 120, 
		top: 2, 
		left: 30, 
		enabled: false
	});

	var passBtn = Ti.UI.createButton({
		title: 'Pass', 
		height: 40, 
		width: 120, 
		top: 2, 
		right: 30,
		enabled: false
	});
	
	var userResponseLbl = Ti.UI.createLabel({
		text: "You Liked",
		color: 'red',
		top: 2, 
		left: 100,
		font: {fontSize: 20, fontWeight: 'bold'},
	});

	var nameSection = Ti.UI.createLabel({
		text: 'Name: private until connected',
		top: 5,
		left: 30,
		color: 'black',
		font: {fontSize: 14}	
	});	
	
	likeBtn.addEventListener("click", function() {
		Ti.API.info('like btn is clicked');
	});
	
	passBtn.addEventListener("click", function() {
		Ti.API.info('pass btn is clicked');
	});
	
	function populateMatchDataTableView(_matchInfo) {
		data = []; //reset table data
		matchId = _matchInfo.meta.match_id; 
		var pronoun = "she";
		var possessive = "her";
		
		if(_matchInfo.content.general.gender == "male") {
			pronoun = "he";
			possessive = "his";
		}

		//profile image section
		//line below --> might have a race condition here if internet is super fast--navGroup will not be set
		var profileImageView = new ProfileImageViewModule(navGroup, _matchInfo.content.pictures); 
		var profileImageRow = Ti.UI.createTableViewRow({backgroundColor:'#ffffff',backgroundSelectedColor:'#dddddd'});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		profileImageRow.add(profileImageView);
		data.push(profileImageRow);
		
		//buttons section
		var responseRow = Ti.UI.createTableViewRow({backgroundColor:'#ffffff',backgroundSelectedColor:'#dddddd'}); 
		if(Ti.Platform.osname === 'iphone')
			responseRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
		if(_matchInfo.content.user_response == 0) { 
			responseRow.add(likeBtn);
			responseRow.add(passBtn);
		} else {
			responseRow.add(userResponseLbl);
			if(_matchInfo.content.user_response == 2) {
				userResponseLbl.text = "You passed";
			}
		}
		data.push(responseRow);
		
		//GENERAL SECTION
		var nameStr = 'private until connected';
		if(_matchInfo.content.is_connected)
    		nameStr = _matchInfo.content['general'].first_name;		
		
		var nameTableViewRow = new TextDisplayTableViewRow('name','Name', nameStr);
		data.push(nameTableViewRow);
		
		var ageTableViewRow = new TextDisplayTableViewRow('age','Age/zodiac', _matchInfo.content['general'].age+' ('+ _matchInfo.content['general'].zodiac + '), '+ _matchInfo.content['general'].city);
		data.push(ageTableViewRow);
		
		var heightTableViewRow = new TextDisplayTableViewRow('height','Height (cm)', _matchInfo.content['height']);
		data.push(heightTableViewRow); //require
	
		var ethnicityTableViewRow = new TextDisplayTableViewRow('ethnicity','Ethnicity', _matchInfo.content['ethnicity']);
		data.push(ethnicityTableViewRow); //require
		
		var religionTableViewRow = new TextDisplayTableViewRow('religion','Religion', _matchInfo.content['religion']);
		data.push(religionTableViewRow);
		
		var occupationTableViewRow = new TextDisplayTableViewRow('occupation','Occupation', _matchInfo.content['work'].occupation);
		data.push(occupationTableViewRow);
		
		var employerTableViewRow = new TextDisplayTableViewRow('employer','Employer', _matchInfo.content['work'].employer);
		data.push(employerTableViewRow);

		//EDUCATION SECTION
		var educationSection = Ti.UI.createTableViewSection({headerTitle:'Education'});	
		
		for(var i = 0; i < _matchInfo.content.educations.length; i++) {
			var curEd = _matchInfo.content.educations[i]; 
			var desc = "";
			if(curEd.level === "high_school") desc = "High School";
			else if(curEd.level === "college") desc = "Bachelor";
			else desc = "Master/PhD";
			
			if(curEd.name !== "") {
				var educationTableViewRow = new TextDisplayTableViewRow(curEd.level, desc, curEd.name);	
				educationSection.add(educationTableViewRow);
			}
		}
		data.push(educationSection);

		//ABOUTME SECTION	
		var aboutMeSection = Ti.UI.createTableViewSection({headerTitle:'About Me'});	
		var aboutMeTableViewRow = new TextDisplayTableViewRow('about_me','', _matchInfo.content['about_me']);
		aboutMeSection.add(aboutMeTableViewRow);
		data.push(aboutMeSection);

		//INTERESTING FACTS
		var funFactsSection = Ti.UI.createTableViewSection({headerTitle:'Fun Facts'});	

		var genderCentricTableViewRow = new TextDisplayTableViewRow('gender_centric','', 'Your friends are '+_matchInfo.content['gender_centric'].female+'% girls and '+_matchInfo.content['gender_centric'].male+'% guys');
		funFactsSection.add(genderCentricTableViewRow);

		var globalStatusTableViewRow = new TextDisplayTableViewRow('global_status','', 'Your friendship spans in '+_matchInfo.content['global_status']+' countries');
		funFactsSection.add(globalStatusTableViewRow);
				
		var socialScoreTableViewRow = new TextDisplayTableViewRow('social_score','', 'Based on your social media activity, your socialized score is '+_matchInfo.content['social_activity']+'%');
		funFactsSection.add(socialScoreTableViewRow);
		data.push(funFactsSection);
		
		contentView.data = data;

		self.add(contentView);
	}
	
	if(_matchId === null) {
		BackendMatch.getLatestMatchInfo(_userId, function(_matchInfo) {	
			populateMatchDataTableView(_matchInfo);
		});	
	} else {
		BackendMatch.getMatchInfo({userId:_userId, matchId:_matchId}, function(_matchInfo) {	
			populateMatchDataTableView(_matchInfo);
		});
	}

	var closeCallback = function() {
		Ti.API.info('closing todayMatchWindow...');
		Ti.App.removeEventListener('close', closeCallback);	
	};
	
	self.setNavGroup = function(_navGroup) {
		navGroup = _navGroup;	
	};
	
	self.addEventListener('close', closeCallback);
		
	return self;
};

module.exports = MatchWindow;

