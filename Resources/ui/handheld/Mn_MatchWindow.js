MatchWindow = function(_userId, _matchId) {
	//Ti.App.Flurry.logTimedEvent('main-match-window');
	
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendMatch = require('backend_libs/backendMatch');
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
	var showLikePassButtons = true;
	
	var self = Ti.UI.createWindow({
		top:0,
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		zIndex:1
	});
	
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		backgroundSelectedImage: 'images/top-bar-button-active.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/edit/topbar-glyph-cancel.png',
	});
	
	if(_matchId !== null) { //case for pulling previous (connected) match to reveal
		//only adding the back button if the screen comes from the chat screen
		self.leftNavButton = backButton;
		showLikePassButtons = false;
	}	
				
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
		separatorColor: 'transparent',
		//width:'100%',
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
								
	var dataForProfile = [];
	
	function educationCmpFn(a, b) {
		if(a.value < b.value) return -1; 
		else if(a.value > b.value) return 1;
		else return 0;
	}
	
	var mutualFriendsRow  = null;
	function populateMatchDataTableView(_matchInfo) {
		Ti.App.GATracker.trackScreen("MatchScreen");
		
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
		
		var matchProfileData = []; //reset table data
		matchId = _matchInfo.meta.match_id;

		//profile image section
		//line below --> might have a race condition here if internet is super fast--navGroup will not be set
		
		var profileImageView = new ProfileImageViewModule(navGroup, _matchInfo.content.pictures, _userId, matchId, showLikePassButtons); 
		
		var profileImageRow = Ti.UI.createTableViewRow({backgroundColor:'transparent',backgroundSelectedColor:'transparent'});
		if(Ti.Platform.osname === 'iphone')
			profileImageRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
		profileImageRow.add(profileImageView);
		matchProfileData.push(profileImageRow);

		if(showLikePassButtons && _matchInfo.content.user_response !== "") { //only show the state if like/pass buttons are showing too
			var selectedState = "like"; 
			
			if(_matchInfo.content.user_response === "pass")
				selectedState = "pass";
				
			profileImageView.setSelectedState(selectedState);
		}

		var friendRatioRow = new FriendRatioTableViewRow('gender_centric', {'female': _matchInfo.content['gender_centric'].female, 'male': _matchInfo.content['gender_centric'].male});
		matchProfileData.push(friendRatioRow); 

		if(_matchInfo.content['mutual_friends'].length > 0) {
		//if(true) {
			var mutualFriendsContent = {'userId': _userId, 'matchId': matchId, 'mutualFriendsArray':_matchInfo.content['mutual_friends'] };
			//var mutualFriendsContent = {'userId': _userId, 'matchId': matchId, 'mutualFriendsArray': ['4', '5']};
			var isLatestMatch = true;
			if(_matchId !== null) isLatestMatch = false;
			mutualFriendsRow = null;
			mutualFriendsRow = new MutualFriendsTableViewRow('mutual_friends', mutualFriendsContent,  _matchInfo.content['show_mutual_friends'], isLatestMatch);
			matchProfileData.push(mutualFriendsRow); 
		}
		
		var whiteOrGrayFlag = true;
		//GENERAL SECTION
		var nameStr = L('private until connected');
		if(_matchInfo.content.is_connected)
    		nameStr = _matchInfo.content['general'].first_name;
		
		if(_matchId !== null) {  //case for pulling previous (connected) match to reveal
			self.title = _matchInfo.content['general'].first_name + L('\'s Profile');
		}
		
		var nameTableViewRow = new TextDisplayTableViewRow('name', nameStr, whiteOrGrayFlag);
		matchProfileData.push(nameTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		var ageTableViewRow = new TextDisplayTableViewRow('age', _matchInfo.content['general'].age + ' ' + L('years old'), whiteOrGrayFlag);
		matchProfileData.push(ageTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		var zodiacTableViewRow = new TextDisplayTableViewRow('zodiac', _matchInfo.content['general'].zodiac, whiteOrGrayFlag);
		matchProfileData.push(zodiacTableViewRow);
		whiteOrGrayFlag = !whiteOrGrayFlag;
		 
		if(_matchInfo.content['general'].city !== "" || _matchInfo.content['general'].country !== "") {
			var locationTableViewRow = new TextDisplayTableViewRow('location', {'city':_matchInfo.content['general'].city, 'country':_matchInfo.content['general'].country}, whiteOrGrayFlag);
			matchProfileData.push(locationTableViewRow);		
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['height'] !== "" ) {
			var heightTableViewRow = new TextDisplayTableViewRow('height', _matchInfo.content['height'] + ' ' + L('cm'), whiteOrGrayFlag);
			matchProfileData.push(heightTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['ethnicity'] !== "" ) {		
			var ethnicityTableViewRow = new TextDisplayTableViewRow('ethnicity', _matchInfo.content['ethnicity'], whiteOrGrayFlag);
			matchProfileData.push(ethnicityTableViewRow); //require
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		if(_matchInfo.content['religion'] !== "" ) {		
			var religionTableViewRow = new TextDisplayTableViewRow('religion', _matchInfo.content['religion'], whiteOrGrayFlag);
			matchProfileData.push(religionTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag;
		}
		
		if(_matchInfo.content['work'].employer !== "" || _matchInfo.content['work'].occupation !== "") {		
			var workTableViewRow = new WorkTableViewRow('work', _matchInfo.content['work'].employer, _matchInfo.content['work'].occupation, whiteOrGrayFlag);
			matchProfileData.push(workTableViewRow);
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
			matchProfileData.push(educationTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}

		//ABOUTME SECTION	
		if(_matchInfo.content['about_me'] !== "" ) {	
			var aboutMeTableViewRow = new AboutMeTableViewRow('about_me', _matchInfo.content['about_me'], whiteOrGrayFlag);
			matchProfileData.push(aboutMeTableViewRow);
			whiteOrGrayFlag = !whiteOrGrayFlag; 
		}
		
		var fbLikeCollection = ModelFacebookLike.getAllFacebookLike(_matchInfo.content.general.user_id);
		if(fbLikeCollection.length > 0) {
			var fbLikeTableViewRow = new FbLikeTableViewRow('fb_like', fbLikeCollection, whiteOrGrayFlag);
			matchProfileData.push(fbLikeTableViewRow);
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
		matchProfileData.push(edgeGradientTableViewRow); 

		var reportProfileTableViewRow = new ReportProfileTableViewRow(_userId, _matchInfo.content.general.user_id); 
		matchProfileData.push(reportProfileTableViewRow);

		return matchProfileData; 
	}
	
	var doHouseKeepingTasks = function(_iOSVersion) {
		var RateReminder = require('internal_libs/rateReminder');
		RateReminder.checkReminderToRate(_userId);
				
		//check version
		if(Ti.App.Properties.getString('clientVersion') < _iOSVersion) {
			var UpdateRequester = require('internal_libs/updateReminder');
			UpdateRequester.requestToUpdate();	
		}		
	};
	
	if(_matchId === null) {
		showPreloader(self, L('Loading...'));
		BackendMatch.getLatestMatchInfo(_userId, function(_matchInfo) {
			if(_matchInfo.success) {
				doHouseKeepingTasks(_matchInfo.meta.ios_version);
				contentView.data = populateMatchDataTableView(_matchInfo);
				self.add(contentView);
				
				if(_matchInfo.content.is_connected) {
					BackendMatch.setCurrentMatchConnected();
				}
			}
			hidePreloader(self);
		});
	} else {
		showPreloader(self, L('Loading...'));
		BackendMatch.getMatchInfo({userId:_userId, matchId:_matchId}, function(_matchInfo) {	
			if(_matchInfo.success) {
				contentView.data = populateMatchDataTableView(_matchInfo);
				self.add(contentView);
			}
			hidePreloader(self);
		});
	}
	
	var closeCallback = function() {
		//Ti.App.Flurry.endTimedEvent('main-match-window');
		self.removeEventListener('close', closeCallback);	
	};
	self.addEventListener('close', closeCallback);	
	
	self.notifyMutualFriendsWindowClose = function() {
		if(mutualFriendsRow !== null) {
			mutualFriendsRow.mutualFriendsWindowIsClose();
		}	
	};
	
	self.setNavGroup = function(_navGroup) {
		navGroup = _navGroup;	
		if(_matchId !== null) {
			backButton.addEventListener('click', function() {
				navGroup.close(self, {animated:true}); //go to the main screen
			});
		}
	};

	self.reloadMatch = function() {
		if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
			//firing the event
			Ti.App.fireEvent('openNoInternetWindow');
		} else {
			if(_matchId === null) {
				if(!BackendMatch.isLatestMatchConnected()) { //only fetch if it is NOT latest
					BackendMatch.getLatestMatchInfo(_userId, function(_matchInfo) {
						if(_matchInfo.success) {							
							doHouseKeepingTasks(_matchInfo.meta.ios_version);			
							contentView.data = populateMatchDataTableView(_matchInfo);	
							
							if(_matchInfo.content.is_connected) {
								BackendMatch.setCurrentMatchConnected();
							}
						}
					}); 
				}
			} else {	
				BackendMatch.getMatchInfo({userId:_userId, matchId:_matchId}, function(_matchInfo) {	
					if(_matchInfo.success)
						contentView.data = populateMatchDataTableView(_matchInfo);
				});
			}
		}
	};

	return self;
};

module.exports = MatchWindow;