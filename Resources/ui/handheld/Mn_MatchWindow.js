MatchWindow = function(_userId, _matchId) {
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendMatch = require('backend_libs/backendMatch');
	var BackendCredit = require('backend_libs/backendCredit');	
	var matchId = -1;
	var ProfileImageViewModule = require('ui/handheld/Mn_ProfileImageView');
	var TextDisplayTableViewRow = require('ui/handheld/Mn_TextDisplayTableViewRow');
	var CustomPagingControl = require('external_libs/customPagingControl');
	var FriendRatioTableViewRow = require('ui/handheld/Mn_FriendRatioTableViewRow');

	var navGroup = null;
	
	//create component instance
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
	});
				
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
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
		left: 30
	});

	var passBtn = Ti.UI.createButton({
		title: 'Pass', 
		height: 40, 
		width: 120, 
		top: 2,
		right: 30
	});
	
/*	var userResponseLbl = Ti.UI.createLabel({
		text: "You Liked",
		color: 'red',
		top: 2, 
		left: 100,
		font: {fontSize: 20, fontWeight: 'bold'},
	});
*/
	var nameSection = Ti.UI.createLabel({
		text: 'Name: private until connected',
		top: 5,
		left: 30,
		color: 'black',
		font: {fontSize: 14}	
	});	
	
	likeBtn.addEventListener("click", function() {
		var currentCredit = CreditSystem.getUserCredit();
		if(currentCredit < 10) {
			var notEnoughCreditsDialog = Titanium.UI.createAlertDialog({
				title:'Insufficient Credits',
				message:L('You need 10 credits to \'Like\' a person. Invite more friends to get more credits.')
			});
			notEnoughCreditsDialog.show();
		} else {				
			//send off the point deductions to server
			BackendCredit.transaction({userId: _userId, amount: (-1)*Ti.App.LIKE_CREDITS_SPENT, action: 'like'}, function(_currentCredit){
				CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
			});
				
			//save that the user like the person
			var matchResponseObj = {matchId: matchId, userId: _userId, response:"like"};
			BackendMatch.saveResponse(matchResponseObj, function(e){
				if(e.success) Ti.API.info('save response (like) successfully');
				else Ti.API.info('save response (like) failed');
			});	
				
			contentView.deleteRow(1); 
/*
			var responseRow = Ti.UI.createTableViewRow({backgroundColor:'#ffffff',backgroundSelectedColor:'#dddddd'}); 
			if(Ti.Platform.osname === 'iphone')
				responseRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			responseRow.add(userResponseLbl);
			contentView.insertRowAfter(0, responseRow,true);
*/
		}
	});
	
	passBtn.addEventListener("click", function() {
		var matchResponseObj = {matchId: matchId, userId: _userId, response:"pass"}
		BackendMatch.saveResponse(matchResponseObj, function(e){
			if(e.success) Ti.API.info('save response (pass) successfully');
			else Ti.API.info('save response (pass) failed');
		});
		
		contentView.deleteRow(1); 
/*
		var responseRow = Ti.UI.createTableViewRow({backgroundColor:'#ffffff',backgroundSelectedColor:'#dddddd'}); 
		if(Ti.Platform.osname === 'iphone')
			responseRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		userResponseLbl.text = "You passed";
		responseRow.add(userResponseLbl);
		contentView.insertRowAfter(0, responseRow,true);
*/
	});
	
	function populateMatchDataTableView(_matchInfo) {
		data = []; //reset table data
		matchId = _matchInfo.meta.match_id; 
		var pronoun = "she";
		var possessive = "her";
		
		if(_matchInfo.content.general.gender === "male") {
			pronoun = "he";
			possessive = "his";
		}

		//profile image section
		//line below --> might have a race condition here if internet is super fast--navGroup will not be set
		
		var profileImageView = new ProfileImageViewModule(navGroup, _matchInfo.content.pictures); 
		
		var profileImageRow = Ti.UI.createTableViewRow({backgroundColor:'transparent',backgroundSelectedColor:'transparent'});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		profileImageRow.add(profileImageView);
		data.push(profileImageRow);
		
		//var friendRatioRow = new FriendRatioTableViewRow('gender_centric', {'female': _matchInfo.content['gender_centric'].female, 'male': _matchInfo.content['gender_centric'].male});
		var friendRatioRow = new FriendRatioTableViewRow('gender_centric', {'female': 554, 'male': 659});
		data.push(friendRatioRow); 

		//buttons section
		/*
			var responseRow = Ti.UI.createTableViewRow({backgroundColor:'#ffffff',backgroundSelectedColor:'#dddddd'}); 
			if(Ti.Platform.osname === 'iphone')
				responseRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			if(_matchInfo.content.user_response === "") { 
				responseRow.add(likeBtn);
				responseRow.add(passBtn);
			} else {
				responseRow.add(userResponseLbl);
				if(_matchInfo.content.user_response === "pass") {
					userResponseLbl.text = "You passed";
				}
			}
			data.push(responseRow);
		*/
		//GENERAL SECTION
		var nameStr = 'private until connected';
		if(_matchInfo.content.is_connected)
    		nameStr = _matchInfo.content['general'].first_name;		
		
		var nameTableViewRow = new TextDisplayTableViewRow('name', nameStr, true);
		data.push(nameTableViewRow);
		
		var ageTableViewRow = new TextDisplayTableViewRow('age', _matchInfo.content['general'].age, false);
		data.push(ageTableViewRow);
		
		var zodiacTableViewRow = new TextDisplayTableViewRow('zodiac', _matchInfo.content['general'].zodiac, true);
		data.push(zodiacTableViewRow);
		
		var locationTableViewRow = new TextDisplayTableViewRow('location', _matchInfo.content['general'].city, false);
		data.push(ageTableViewRow);		
		
		var heightTableViewRow = new TextDisplayTableViewRow('height', _matchInfo.content['height'], true);
		data.push(heightTableViewRow); //require
	
		var ethnicityTableViewRow = new TextDisplayTableViewRow('ethnicity', _matchInfo.content['ethnicity'], false);
		data.push(ethnicityTableViewRow); //require
		
		var religionTableViewRow = new TextDisplayTableViewRow('religion', _matchInfo.content['religion'], true);
		data.push(religionTableViewRow);
		
		var occupationTableViewRow = new TextDisplayTableViewRow('work', _matchInfo.content['work'].occupation, false);
		data.push(occupationTableViewRow);
		
		var employerTableViewRow = new TextDisplayTableViewRow('work',_matchInfo.content['work'].employer, true);
		data.push(employerTableViewRow);

		//EDUCATION SECTION
/*		
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
*/

		//ABOUTME SECTION	
		var aboutMeTableViewRow = new TextDisplayTableViewRow('about_me', _matchInfo.content['about_me'], false);
		data.push(aboutMeTableViewRow);
	
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

