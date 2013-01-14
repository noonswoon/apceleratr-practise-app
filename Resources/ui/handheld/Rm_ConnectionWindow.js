ConnectionWindow = function(_userId) {
	
	var BackendMatch = require('backend_libs/backendMatch');			
	var ConnectionTableViewRow = require('ui/handheld/Rm_ConnectionTableViewRow');

	var connectionTableData = [];
	
	var self = Titanium.UI.createWindow({
		top:0,
		right:0,
		width:260
	});
	
	var connectionTableView = Ti.UI.createTableView({
		top: 30,
		backgroundColor: '#32394a',
		separatorColor: '#242a37',
		editable: true,
	});	

	var editSection = Ti.UI.createView({
		top: 0,
		right:0,
		width: 260,
		height: 30,
		backgroundColor: '#32394a'
	});
	var connectionsLbl = Ti.UI.createLabel({
		text: 'CONNECTIONS',
		color: '#949caa',
		left: 10,
		top: 10,
		font:{fontWeight:'bold',fontSize:11},
	});
	
	var isInEditMode = false;
	var editLbl = Ti.UI.createLabel({
		text: 'EDIT',
		color: '#949caa',
		right: 10,
		top: 10,
		width: 30,
		font:{fontWeight:'bold',fontSize:10},
	});
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

	connectionTableView.addEventListener('click',function(e){
		var chatRoomName = e.row.matchId + "_" + Ti.Utils.md5HexDigest("Noon"+e.row.matchId+"Swoon").substring(0,8);
		Ti.API.info('chatroom: ' + chatRoomName+', other profileId: '+e.row.profileId);
			
		Ti.App.fireEvent('openChatWindow', {chatRoomName:chatRoomName, matchId: e.row.matchId, 
			otherUserId: e.row.profileId, otherUserFirstName: e.row.firstName});
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
	
	return self;
}
module.exports = ConnectionWindow;