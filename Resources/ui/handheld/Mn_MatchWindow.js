MatchWindow = function(_userId, _matchId) {
	Ti.App.Flurry.logTimedEvent('main-match-window');
	
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendMatch = require('backend_libs/backendMatch');
	var BackendCredit = require('backend_libs/backendCredit');	
	var matchId = -1;
	var ProfileImageViewModule = require('ui/handheld/Mn_ProfileImageView');
	var TextDisplayTableViewRow = require('ui/handheld/Mn_TextDisplayTableViewRow');
	var AboutMeTableViewRow = require('ui/handheld/Mn_AboutMeTableViewRow');
	var WorkTableViewRow = require('ui/handheld/Mn_WorkTableViewRow');	
	var EducationTableViewRow = require('ui/handheld/Mn_EducationTableViewRow');	
	var FbLikeTableViewRow = require('ui/handheld/Mn_FbLikeTableViewRow');
	var ReportProfileTableViewRow = require('ui/handheld/Mn_ReportProfileTableViewRow');	
	var FriendRatioTableViewRow = require('ui/handheld/Mn_FriendRatioTableViewRow');
	var MutualFriendsTableViewRow = require('ui/handheld/Mn_MutualFriendsTableViewRow');
	var ModelFacebookLike = require('model/facebookLike');
	
	var navGroup = null;
	
	//create component instance
	
	var self = Ti.UI.createWindow({
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		zIndex:1
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
	
	function educationCmpFn(a, b) {
		if(a.value < b.value) return -1; 
		else if(a.value > b.value) return 1;
		else return 0;
	}
	
	function populateMatchDataTableView(_matchInfo) {		
		//Ti.API.info('matchInfo: '+JSON.stringify(_matchInfo));

		var facebookLikeArray = [];
		//Ti.API.info('_matchInfo.content.likes.length: '+_matchInfo.content.likes.length);
		for(var i = 0; i < _matchInfo.content.likes.length; i++) {
			var likeObj = {
							'category': _matchInfo.content.likes[i].category,
							'name': _matchInfo.content.likes[i].name, 
						};
			facebookLikeArray.push(likeObj);
		}
		ModelFacebookLike.populateFacebookLike(parseInt(_matchInfo.meta.user_id), _matchInfo.content.general.user_id, facebookLikeArray);
		
		data = []; //reset table data
		matchId = _matchInfo.meta.match_id;

		//profile image section
		//line below --> might have a race condition here if internet is super fast--navGroup will not be set
		
		var profileImageView = new ProfileImageViewModule(navGroup, _matchInfo.content.pictures, _userId, matchId, true); 
		
		var profileImageRow = Ti.UI.createTableViewRow({backgroundColor:'transparent',backgroundSelectedColor:'transparent'});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		profileImageRow.add(profileImageView);
		data.push(profileImageRow);

		if(_matchInfo.content.user_response !== "") {
			var selectedState = "like"; 
			
			if(_matchInfo.content.user_response === "pass")
				selectedState = "pass";
				
			profileImageView.setSelectedState(selectedState);
		}

		var friendRatioRow = new FriendRatioTableViewRow('gender_centric', {'female': _matchInfo.content['gender_centric'].female, 'male': _matchInfo.content['gender_centric'].male});
		data.push(friendRatioRow); 

		if(_matchInfo.content['mutual_friends'].length > 0) {
			var mutualFriendsContent = {'userId': _userId, 'matchId': matchId, 'mutualFriendsArray':_matchInfo.content['mutual_friends'] };
			var mutualFriendsRow = new MutualFriendsTableViewRow('mutual_friends', mutualFriendsContent,  _matchInfo.content['show_mutual_friends']);
			data.push(mutualFriendsRow); 
		}
		
		var whiteOrGrayFlag = true;
		//GENERAL SECTION
		var nameStr = 'private until connected';
		if(_matchInfo.content.is_connected)
    		nameStr = _matchInfo.content['general'].first_name;		
		
		var nameTableViewRow = new TextDisplayTableViewRow('name', nameStr, whiteOrGrayFlag);
		data.push(nameTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		var ageTableViewRow = new TextDisplayTableViewRow('age', _matchInfo.content['general'].age + L(' years old'), whiteOrGrayFlag);
		data.push(ageTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		var zodiacTableViewRow = new TextDisplayTableViewRow('zodiac', _matchInfo.content['general'].zodiac, whiteOrGrayFlag);
		data.push(zodiacTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		if(_matchInfo.content['general'].city !== "" || _matchInfo.content['general'].country !== "") {
			var locationTableViewRow = new TextDisplayTableViewRow('location', {'city':_matchInfo.content['general'].city, 'country':_matchInfo.content['general'].country}, whiteOrGrayFlag);
			data.push(locationTableViewRow);		
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['height'] !== "" ) {
			var heightTableViewRow = new TextDisplayTableViewRow('height', _matchInfo.content['height'] + " cm", whiteOrGrayFlag);
			data.push(heightTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['ethnicity'] !== "" ) {		
			var ethnicityTableViewRow = new TextDisplayTableViewRow('ethnicity', _matchInfo.content['ethnicity'], whiteOrGrayFlag);
			data.push(ethnicityTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['religion'] !== "" ) {		
			var religionTableViewRow = new TextDisplayTableViewRow('religion', _matchInfo.content['religion'], whiteOrGrayFlag);
			data.push(religionTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_matchInfo.content['work'].employer !== "" || _matchInfo.content['work'].occupation !== "") {		
			var workTableViewRow = new WorkTableViewRow('work', _matchInfo.content['work'].employer, _matchInfo.content['work'].occupation, whiteOrGrayFlag);
			data.push(workTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		var educationArray = [];
		for(var i = 0; i < _matchInfo.content.educations.length; i++) {
			var curEd = _matchInfo.content.educations[i]; 
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
		if(_matchInfo.content['about_me'] !== "" ) {	
			var aboutMeTableViewRow = new AboutMeTableViewRow('about_me', _matchInfo.content['about_me'], whiteOrGrayFlag);
			data.push(aboutMeTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		var fbLikeCollection = ModelFacebookLike.getFiveRandomFacebookLike(_matchInfo.content.general.user_id);
		if(fbLikeCollection.length > 0) {
			Ti.API.info('fbLikeCollection: '+fbLikeCollection.length);
			var fbLikeTableViewRow = new FbLikeTableViewRow('fb_like', fbLikeCollection, whiteOrGrayFlag);
			data.push(fbLikeTableViewRow);
		}
		
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

		var reportProfileTableViewRow = new ReportProfileTableViewRow(_userId, _matchInfo.content.general.user_id); 
		data.push(reportProfileTableViewRow);

		contentView.data = data;
		self.add(contentView);
	}
	
	if(_matchId === null) {
		showPreloader(self, L('Loading...'));
		BackendMatch.getLatestMatchInfo(_userId, function(_matchInfo) {
			populateMatchDataTableView(_matchInfo);
			hidePreloader(self);
		});	
	} else {
		showPreloader(self, L('Loading...'));
		BackendMatch.getMatchInfo({userId:_userId, matchId:_matchId}, function(_matchInfo) {	
			populateMatchDataTableView(_matchInfo);
			hidePreloader(self);
		});
	}

	var closeCallback = function() {
		Ti.App.Flurry.endTimedEvent('main-match-window');
		Ti.App.removeEventListener('close', closeCallback);	
	};
	
	self.setNavGroup = function(_navGroup) {
		navGroup = _navGroup;	
	};
	
	self.addEventListener('close', closeCallback);
		
	return self;
};

module.exports = MatchWindow;