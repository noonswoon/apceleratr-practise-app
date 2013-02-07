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
		text: 'CONNECTIONS',
		left: 11,
		top: 11,
		color: '#ababab',
		font:{fontWeight:'bold',fontSize:12},
		shadowColor: '#403e3e', 
		shadowOffset: {x:0,y:1}
	});
	
	var editLbl = Ti.UI.createLabel({
		text: 'EDIT',
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
			editLbl.text = 'DONE';
		} else {
			connectionTableView.editing = false;
			isInEditMode = false;
			editLbl.text = 'EDIT';
		}
	});

	var connectionTableView = Ti.UI.createTableView({		
		backgroundColor: '#4a4949',
		separatorColor: 'transparent',
		top: 38,
		left: 0,
		editable: true
	});	
	
	connectionTableView.addEventListener('click',function(e){
		var chatRoomName = e.row.matchId + "_" + Ti.Utils.md5HexDigest("Noon"+e.row.matchId+"Swoon").substring(0,8);
		Ti.API.info('chatroom: ' + chatRoomName+', other profileId: '+e.row.profileId);
			
		Ti.App.fireEvent('openChatWindow', {chatRoomName:chatRoomName, matchId: e.row.matchId, 
			otherUserId: e.row.profileId, otherUserFirstName: e.row.firstName, otherUserImage: e.row.profileImage});
	});
	
	BackendMatch.getConnectedMatch(_userId, function(_connectedMatchInfo) {	
		connectionTableData = []; //reset table data
		connectedMatches = _connectedMatchInfo.content.connected_matches; 
		for(var i = 0; i < connectedMatches.length; i++) {
			var curConnect = connectedMatches[i];
			var personRow = new ConnectionTableViewRow(_userId, curConnect);
			connectionTableData.push(personRow);
		}
		connectionTableView.setData(connectionTableData);
	});
	
	// add delete event listener
	connectionTableView.addEventListener('delete',function(e) {
		BackendMatch.deleteConnectedMatch({matchId: e.rowData.matchId, userId:_userId}, function(e) {
			if(e.success) Ti.API.info('delete connected match success');
			else Ti.API.info('delete connected match failed');
		});
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
	
	return self;
}
module.exports = ConnectionWindow;