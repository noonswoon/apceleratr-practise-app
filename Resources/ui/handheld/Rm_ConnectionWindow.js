ConnectionWindow = function(_userId) {
	
	var BackendMatch = require('backend_libs/backendMatch');			
	var ConnectionTableViewRow = require('ui/handheld/Rm_ConnectionTableViewRow');

	var connectionTableData = [];
	
	var self = Titanium.UI.createWindow({
		top:0,
		right:0,
		width:260,
		zIndex:0,
	});

	var menuShadow = Ti.UI.createImageView({
		backgroundImage: 'images/right_menu/right-menu-shadow.png',
		backgroundTopCap: 1,
		top: 0,
		left: 0, 
		width: 12,
		height: '100%',
		zIndex: 5,
	});
	self.add(menuShadow);
	
	var editSection = Ti.UI.createView({
		top: 0,
		left:0,
		width: 260,
		height: 38,
		borderColor: 'transparent',
		borderWidth: 0,
		backgroundImage: 'images/menu-separator.png'
	});	
	
	var connectionsLbl = Ti.UI.createLabel({
		text: L('CONNECTIONS'),
		left: 11,
		top: 11,
		color: '#ababab',
		font:{fontWeight:'bold',fontSize:12},
		shadowColor: '#403e3e', 
		shadowOffset: {x:0,y:1}
	});
	
	var editLbl = Ti.UI.createLabel({
		text: L('EDIT'),
		color: '#ababab',
		right: 10,
		top: 10,
		width: 35,
		font:{fontWeight:'bold',fontSize:12},
		shadowColor: '#403e3e', 
		shadowOffset: {x:0,y:1}
	});
		
	var isInEditMode = false;
	editSection.add(connectionsLbl);
	editSection.add(editLbl);
	
	editLbl.addEventListener('click', function() {
		if(!isInEditMode) {
			connectionTableView.editing = true;
			isInEditMode = true;
			editLbl.text = L('DONE');
		} else {
			connectionTableView.editing = false;
			isInEditMode = false;
			editLbl.text = L('EDIT');
		}
	});

	var connectionTableView = Ti.UI.createTableView({		
		backgroundColor: '#4a4949',
		separatorColor: 'transparent',
		top: 38,
		left: 0,
		editable: true
	});
	
	var totalUnreadMessages = 0;
	
	var loadConnectedMatches = function() {
		if(Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
			//firing the event
			Ti.App.fireEvent('openNoInternetWindow');
		} else {
			BackendMatch.getConnectedMatch(_userId, function(_connectedMatchInfo) {	
				if(_connectedMatchInfo.success) {
					connectionTableData = []; //reset table data
					var connectedMatches = _connectedMatchInfo.content.connected_matches; 
					totalUnreadMessages = 0;
					for(var i = 0; i < connectedMatches.length; i++) {
						var curConnect = connectedMatches[i];
						if(curConnect.number_unread_messages !== "") {
							totalUnreadMessages = totalUnreadMessages + curConnect.number_unread_messages;
						}
						var personRow = new ConnectionTableViewRow(_userId, curConnect);
						connectionTableData.push(personRow);
					}
					connectionTableView.setData(connectionTableData);
					if(totalUnreadMessages > 0) {
						Ti.App.fireEvent('showUnreadChatGreenButton');
					}
				}
			});	 
		}
	};
	
	connectionTableView.addEventListener('click',function(e){
		var chatRoomName = e.row.matchId + "_" + Ti.Utils.md5HexDigest("Noon"+e.row.matchId+"Swoon").substring(0,8);
		var numUnreadThisMatch = e.row.unreadMessages;
		
		totalUnreadMessages = totalUnreadMessages - numUnreadThisMatch; 
		if(totalUnreadMessages <= 0) { //no more unread message
			Ti.App.fireEvent('showNormalChatButton');
			totalUnreadMessages = 0;
		}
			
		Ti.App.fireEvent('openChatWindow', {
			chatRoomName:chatRoomName, matchId: e.row.matchId, 
			otherUserId: e.row.profileId, otherUserFirstName: e.row.firstName,
			otherUserImage: e.row.profileImage, otherUserGuid: e.row.guid
		});

	});
	
	loadConnectedMatches();
	
	// add delete event listener
	connectionTableView.addEventListener('delete',function(e) {
		BackendMatch.deleteConnectedMatch({matchId: e.rowData.matchId, userId:_userId}, function(e) {
			if(e.success) Ti.API.info('delete connected match success');
			else Ti.API.info('delete connected match failed');
		});
		Ti.App.NSAnalytics.trackEvent("RightMenu","ConnectionDeleted","",1);
	});
	
	self.add(editSection);
	self.add(connectionTableView);	
	
	var coverView = Titanium.UI.createView({
		top:0,
		right:0,
		width:260,
		backgroundColor: '#eeeeee',
		zIndex:5,
	});
	self.add(coverView);
	
	self.unhideCoverView = function() {
		self.remove(coverView);
	};
	
	self.reloadConnections = function() {
		Ti.App.fireEvent('showNormalChatButton'); //reset to normal everytime reload
		loadConnectedMatches();
	};
	
	return self;
};
module.exports = ConnectionWindow;