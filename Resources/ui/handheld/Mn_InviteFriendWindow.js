InviteFriendWindow = function(_userId) {
		
	var InviteFriendTableViewRow = require('ui/handheld/Mn_InviteFriendTableViewRow');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendCredit = require('backend_libs/backendCredit');
	var BackendInvite = require('backend_libs/backendInvite');
	
	var targetedList = [];
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
	var userCredit = CreditSystem.getUserCredit();
	var self = Titanium.UI.createWindow({
		barColor:'#489ec3',
		title: L('Get Credits')
	});		

	var mainView = Ti.UI.createView({
		top: 0,
		backgroundColor: '#fff'
	});	
	
	var inviteDescriptionLbl = Ti.UI.createLabel({
		text: 'Get 2 credits for each invite. '+userCredit+' credits remaining.',
		top: 5,
		left: 10,
		color: 'black',
		backgroundColor: 'orange',
		font: {fontSize: 14}	
	});	
	
	var friendScrollView = Ti.UI.createScrollView({
		contentWidth: 320,
		contentHeight: 'auto',
		top: 70,
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
		searchHidden:true,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
	});
	
	var inviteButton = Titanium.UI.createButton({
		color:'black',
		top:30,
		left: 50,
		width:180,
		height:40,
		font:{fontSize:20,fontWeight:'bold'},
		title:'Continue »'
	});
	
	var inviteFirstLbl = Titanium.UI.createLabel({
		text: 'Invite '+ Ti.App.NUM_INVITE_ALL, 
		height: 15,
		right: 30,
		top: 35,
		color: 'grey',
		font: {fontSize: 12}	
	});
	
	var friendsLbl = Titanium.UI.createLabel({
		text: 'friends', 
		height: 15,
		right: 30,
		top: 45,
		color: 'grey',
		font: {fontSize: 12}	
	});

	var checkbox = Ti.UI.createButton({
	    title: '\u2713',
	    top: 40,
	    right: 10,
	    width: 15,
	    height: 15,
	    borderColor: '#666',
	    borderWidth: 2,
	    borderRadius: 3,
	    color: 'black',
	    font:{fontSize: 12, fontWeight: 'bold'},
	    value: true //value is a custom property in this casehere.
	});
 
	//Attach some simple on/off actions
	checkbox.on = function() {
	    this.title='\u2713';
	    this.value = true;
	};
	 
	checkbox.off = function() {
	    this.title='';
	    this.value = false;
	};
	 
	checkbox.addEventListener('click', function(e) {
	    if(false == e.source.value) {
	        e.source.on();
	        Ti.API.info("firing event: inviteall true");
	        Ti.App.fireEvent("inviteAllToggled", {inviteAll:true});
	    } else {
	        e.source.off();
	        Ti.API.info("firing event: inviteall false");
	        Ti.App.fireEvent("inviteAllToggled", {inviteAll:false});
	    }
	});	
	

	facebookFriendSearch.addEventListener('return', function(e) {
		facebookFriendSearch.blur();
	});
	
	facebookFriendSearch.addEventListener('cancel', function(e) {
		facebookFriendSearch.blur();
	});		
	
	var createFriendTable = function(_friendList){
		var tableData = [];
		
		for(var i = 0; i<_friendList.length;i++) {
			var curUser = _friendList[i];
			var userRow = new InviteFriendTableViewRow(curUser,i);
			tableData.push(userRow);
		}
		return tableData;
	};
	
	var facebookFriendQuery = function() {
		if (!Titanium.Facebook.loggedIn) Ti.UI.createAlertDialog({title:'noonswoon', message:L('Login before running query')}).show();
		//run query
		else{	
			// run query, populate table view and open window			
			// only invite people in Bangkok
			
			var query = "SELECT uid, name, pic_square, current_location FROM user ";
			query +=  "where uid IN (SELECT uid2 FROM friend WHERE uid1 = " + Titanium.Facebook.uid + ")";
			query += " and not is_app_user";
			query += " and (relationship_status != 'In a relationship' and relationship_status != 'Engaged'";
			query += " and relationship_status != 'Married') order by first_name";
	
			Titanium.Facebook.request('fql.query', {query: query},  function(r) {
				if (!r.success) {
					if (r.error) Ti.API.info(r.error);
					else Ti.API.info("Call was unsuccessful");
				} else {
					var friendList = JSON.parse(r.result);
					
					Ti.API.info("Main Invite Page..data: "+JSON.stringify(friendList));
					var candidateList = []; 
					//need to exclude people from out-of-town
					
					if(offeredCities === 'all') {
						for(var i = 0; i < friendList.length; i++)
							candidateList.push({uid: friendList[i].uid, name: friendList[i].name, pic_square: friendList[i].pic_square});
					} else {
						for(var i = 0; i < friendList.length; i++) {
							if(friendList[i].current_location && offeredCities.indexOf(friendList[i].current_location.city) != -1) {
								candidateList.push({uid: friendList[i].uid, name: friendList[i].name, 
													pic_square: friendList[i].pic_square, city: friendList[i].current_location.city});
							}
						}
					}
					
					BackendInvite.getInvitedList(_userId, function(invitedList) {
						targetedList = [];
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

						var friendTableRowData = createFriendTable(targetedList);
						facebookFriendTableView.setData(friendTableRowData);
					});
				}
			});			
		}	
	};

	if(Ti.Platform.osname == 'iphone') {
		showPreloader(self,'Loading...');
	
		setTimeout(function() {
			Ti.API.info('force close loading screen');
			hidePreloader(self);
		}, 10000);
	}
	
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
	
	Ti.App.addEventListener('inviteCompleted', function(e){
		//iterate to remove the table view row	
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < facebookFriendTableView.data[0].rowCount; j++) {
				var row = facebookFriendTableView.data[0].rows[j];
				if(row.uid === Number(e.inviteeList[i])) {
					targetedRow = j;
					break;
				}
			}
			facebookFriendTableView.deleteRow(targetedRow);	
			topupAmount += 2;
		}
		var invitedData = {userId:_userId, invitedFbIds:e.inviteeList};
		BackendInvite.saveInvitedPeople(invitedData, Ti.App.API_SERVER, Ti.App.API_ACCESS, function(e){
			if(e.success) Ti.API.info('saveInvitePeople from fb successful');
			else Ti.API.info('saveInvitePeople from fb failed');
		});
		BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
			CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
			inviteDescriptionLbl.text = 'Get 2 credits for each invite. '+_currentCredit +' credits remaining.';
		});
	});
	
	self.addEventListener('focus', function() {
		Ti.API.info('onfocus - Invite Window');
	});	

	Ti.App.addEventListener('creditChange', function() {
		inviteDescriptionLbl.text = 'Get 2 credits for each invite. '+ CreditSystem.getUserCredit() +' credits remaining.';	
	});
	
	facebookFriendQuery();
	friendScrollView.add(facebookFriendTableView); //index: 0 -> default tab

	mainView.add(inviteDescriptionLbl);
	mainView.add(inviteButton);
	mainView.add(inviteFirstLbl);
	mainView.add(friendsLbl);
	mainView.add(checkbox);	
	mainView.add(friendScrollView);
	
	self.add(mainView);	
	return self;
}
module.exports = InviteFriendWindow;
