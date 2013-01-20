InviteFriendWindow = function(_userId, _forcedInvite) {
		
	var InviteFriendTableViewRow = require('ui/handheld/Mn_InviteFriendTableViewRow');
	var FacebookSharing = require('internal_libs/facebookSharing');
	var CreditSystem = require('internal_libs/creditSystem');
	var BackendCredit = require('backend_libs/backendCredit');
	var BackendInvite = require('backend_libs/backendInvite');
	var FacebookFriend = require('model/facebookFriend');
	
	var isNavBarHidden = false;
	var numFriendsTogo = 0;
	
	if(_forcedInvite) {
		isNavBarHidden = true;
		numFriendsTogo = 2;
	}
	
	var targetedList = [];
	var offeredCities = Ti.App.OFFERED_CITIES.join(',');
	var userCredit = CreditSystem.getUserCredit();
	var self = Titanium.UI.createWindow({
		barColor: Ti.App.BACKGROUND_BAR_COLOR_THEME,
		title: L('Invite Friends'),
		navBarHidden: isNavBarHidden
	});

	var facebookFriendSearch = Titanium.UI.createSearchBar({
		barColor:'#d3dbdf',
		showCancel:false,
		hintText:'Search',
		backgroundImage: 'images/searchbar_white.png',
		borderWidth: 0,
	});

	var facebookFriendTableView = Ti.UI.createTableView({
		searchHidden:false,
		search: facebookFriendSearch,
		filterAttribute: 'filter',
		top: 0,
		width: 320,
		height: 430
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
	
	Ti.App.addEventListener('inviteCompleted', function(e){
		
		//iterate to remove the table view row	
		var topupAmount = 0;
		for(var i = 0; i < e.inviteeList.length; i++) {
			var targetedRow = -1;			
			for(var j = 0; j < facebookFriendTableView.data[0].rowCount; j++) {
				var row = facebookFriendTableView.data[0].rows[j];
				if(row.fbId === e.inviteeList[i]) {
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
		
		if(!_forcedInvite) { //only save the transaction if it isn't a forced invite
			BackendCredit.transaction({userId:_userId, amount:topupAmount, action:'invite'}, function(_currentCredit){
				CreditSystem.setUserCredit(_currentCredit); //sync the credit (deduct points from user
			});
		}
	});

	var friendList = FacebookFriend.getFacebookFriends();
	var friendTableRowData = createFriendTable(friendList);
	facebookFriendTableView.setData(friendTableRowData);

	self.add(facebookFriendTableView);

	var inviteButtonSectionView = Ti.UI.createView({
		backgroundColor: Ti.App.BACKGROUND_BAR_COLOR_THEME,
		height:50,
		bottom: 0
	});
	inviteButtonSectionView.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#6c83b5', offset: 0.0}, { color: '#2d4a88', offset: 1.0 }]
	};

/*
 * win.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#d2d1d0', offset: 0.0}, { color: '#fffefd', offset: 1.0 }]
	};	
 */

	var inviteButton = Ti.UI.createButton({
		backgroundImage: 'none',
		backgroundColor: 'transparent',
		borderColor: '#1d2536', 
		borderRadius: 5,
		borderWidth: 1,
		color: '#e3e7f0',
		top:5,
		left: 40,
		width:220,
		height:40,
		font:{fontSize:18,fontWeight:'bold'},
		title:'Invite via Facebook'
	});
	inviteButton.backgroundGradient = {
		type: 'linear',
		startPoint: { x: '0%', y: '0%' },
		endPoint: { x: '0%', y: '100%' },
		colors: [{ color: '#5a76ae', offset: 0.0}, { color: '#2c4880', offset: 1.0 }]
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
	inviteButtonSectionView.add(inviteButton);
	self.add(inviteButtonSectionView);

/*
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
*/
	return self;
}
module.exports = InviteFriendWindow;
