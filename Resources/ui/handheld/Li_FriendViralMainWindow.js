FriendViralMainWindow = function(_userId) {

	//differences from the main invite scree
	//invite x more to go
	//no credit update - just get the task done and move
	//to the main screen
	
	var numFriendsTogo = 1; 
	
	var InviteFriendTableViewRow = require('ui/common/Cd_InviteFriendTableViewRow');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var BackendInvite = require('backend_libs/backendInvite');	
	
	var self = Titanium.UI.createWindow({
		barColor:'#489ec3',
		title: '',
		tabBarHidden: true,
		navBarHidden: true
	});		

	var mainView = Ti.UI.createView({
		top: 0,
		backgroundColor: '#fff'
	});	
	
	var descriptionLbl = Ti.UI.createLabel({
		text: 'Noonswoon is more fun with more people.',
		top: 5,
		left: 20,
		color: 'black',
		backgroundColor: 'orange',
		font: {fontSize: 14}	
	});	

	var inviteStatusLbl = Ti.UI.createLabel({
		text: 'Please invite '+ numFriendsTogo +' more friends before you get started',
		top: 25,
		left: 10,
		color: 'black',
		backgroundColor: 'orange',
		font: {fontSize: 12}	
	});	

	var friendScrollView = Ti.UI.createScrollView({
		contentWidth: 320,
		contentHeight: 'auto',
		top: 100,
		showVerticalScrollIndicator: true,
		showHorizontalScrollIndicator: false,
	});	

	var facebookFriendSearch = Titanium.UI.createSearchBar({
		barColor:'#43a5cf',
		showCancel:false,
		hintText:'Search...',
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});

	var facebookFriendTableView = Ti.UI.createTableView({
		searchHidden:false,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
	});
	
	var inviteButton = Titanium.UI.createButton({
		color:'black',
		top:60,
		left: 50,
		width:200,
		height:40,
		font:{fontSize:20,fontWeight:'bold'},
		title:'Continue »',
		enabled: false
	});	

	facebookFriendSearch.addEventListener('return', function(e) {
		facebookFriendSearch.blur();
	});
	
	facebookFriendSearch.addEventListener('cancel', function(e) {
		facebookFriendSearch.blur();
	});		
	
	var facebookFriendQuery = function() {
		if (!Titanium.Facebook.loggedIn) Ti.UI.createAlertDialog({title:'Noonswoon', message:L('Login before running query')}).show();
		//run query
		else{	
			// run query, populate table view and open window			
			// only invite people in Bangkok
			
			var offeredCities = Ti.App.OFFERED_CITIES.join(',');
			Ti.API.info('offeredCities: '+ offeredCities);
			
			var query = "SELECT uid, name, pic_square FROM user ";
			query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
			query += " and current_location.id in (" + offeredCities +") and not is_app_user";
			query += " and (relationship_status != 'In a relationship' and relationship_status != 'Engaged' and relationship_status != 'Married') order by first_name";

			Titanium.Facebook.request('fql.query', {query: query},  function(r) {
				if (!r.success) {
					if (r.error) Ti.API.info(r.error);
					else Ti.API.info("fql.query Call was unsuccessful");
				}
				var candidateList = JSON.parse(r.result);
				BackendInvite.getInvitedList(_userId, function(invitedList) {
					var targetedList = [];
					for(var i = 0; i < candidateList.length; i++) {
						var isInvited = false;
						for(var j = 0; j < invitedList.length; j++) {
							if(String(candidateList[i].uid) === invitedList[j])
								isInvited = true;
						}
						if(!isInvited) {
							targetedList.push(candidateList[i]); //has not invited..adding
						} 
					}
					var friendOnFbRows = createFriendTable(targetedList);
					facebookFriendTableView.setData(friendOnFbRows);
					Ti.API.info('complete loading fb friends');
					//hidePreloader(self);
				});
			});					
		}	
	};
	
	var createFriendTable = function(_friendList){
		var tableData = [];
		
		for(var i = 0; i<_friendList.length;i++) {
			var curUser = _friendList[i];
			var userRow = new InviteFriendTableViewRow(curUser,i, 0);
			tableData.push(userRow);
		}
		return tableData;
	};
	
	inviteButton.addEventListener('click', function() {
		//iterate through the table rows to get the selected id
		var targetedRow = 0;
		var invitedList = [];
		for(var i = 0; i < facebookFriendTableView.data[0].rowCount; i++)
		{
			var row = facebookFriendTableView.data[0].rows[i];
			if(row.isInvited()) {
				invitedList.push(row.uid);
			}
		}
		//Ti.API.info('invitedList: '+JSON.stringify(invitedList));
		FacebookSharing.sendRequestOnFacebook(invitedList.join(','));
	});
	
	var invitedFriendCallback = function(){
		numFriendsTogo--;
		if(numFriendsTogo < 1) {
			inviteButton.enabled = true;
			inviteStatusLbl.text = "Let rock and roll";
			inviteStatusLbl.left = 100;
		} else {
			var s = "s";
			if (numFriendsTogo == 1) s = ""
			
			inviteButton.enabled = false;
			inviteStatusLbl.text = 'Please invite '+ numFriendsTogo +' more friend'+s+'  before you get started';
		}
	};
	Ti.App.addEventListener('invitedFriend', invitedFriendCallback);
	
	var inviteFailedCallback = function(e){
		for(var i = 0; i < facebookFriendTableView.data[0].rowCount; i++) {
			var row = facebookFriendTableView.data[0].rows[i];
			row.reset();
		}
	};
	Ti.App.addEventListener('inviteFailed', inviteFailedCallback);	

	var inviteCompletedCallback = function(e) {
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList};
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(){});

		//move to the profile edit page...
		Ti.App.removeEventListener('invitedFriend', invitedFriendCallback);
		Ti.App.removeEventListener('inviteFailed', inviteFailedCallback);	
		Ti.App.removeEventListener('inviteCompleted', inviteCompletedCallback);
		
		var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
		var maintabgroup = new ApplicationTabGroup(_userId, 3); //open the profile window
		maintabgroup.open();
		
		self.close();
		Ti.App.fireEvent('closeLoginTabGroup'); //done with login, close the tabgroup
	};	
	Ti.App.addEventListener('inviteCompleted', inviteCompletedCallback); 
	
	facebookFriendQuery();
	friendScrollView.add(facebookFriendTableView); //index: 0 -> default tab

	mainView.add(descriptionLbl);
	mainView.add(inviteStatusLbl);
	mainView.add(inviteButton);
	mainView.add(friendScrollView);
	
	self.add(mainView);	
	return self;
}
module.exports = FriendViralMainWindow;