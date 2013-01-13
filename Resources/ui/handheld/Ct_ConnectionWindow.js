ConnectionWindow = function(_userId) {
	
	var BackendMatch = require('backend_libs/backendMatch');			
	var ConnectionTableViewRow = require('ui/handheld/Ct_ConnectionTableViewRow');

	var connectionTableData = [];
	
	var self = Titanium.UI.createWindow({
		top:0,
		right:0,
		width:260
	});
	
	var connectionTableView = Ti.UI.createTableView({
		backgroundColor: 'green',
		separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});	
	
	connectionTableView.addEventListener('click',function(e){
		Ti.API.info('chattable is clicked');
		var chatRoomName = 'dummy';
		//var chatRoomName = e.row.matchId + "_" + Ti.Utils.md5HexDigest("Noon"+e.row.matchId+"Swoon").substring(0,8);
		//Ti.API.info('chatroom: ' + chatRoomName+', other profileId: '+e.row.profileId);
		
		Ti.App.fireEvent('openChatWindow', {chatRoomName:chatRoomName, matchId: 2, 
			otherUserId: 3, otherUserFirstName: 'Mickey'});

/*		var pubnubChatWindow = Ti.App.Chat({
		    "chat-room" : chatRoomName,
		    "window"    : {backgroundColor:'transparent'},
		    matchId	: 2, //e.row.matchId,
		    userId	: 2, //_userId, // _userId,
		    otherUserId : 3, //e.row.profileId,
		    otherUserFirstName: 'Mickey' //e.row.firstName
		});
*/
		// --> need to move this to the main screen somehow!!!
		//self.containingTab.open(pubnubChatWindow.chatWindow);		
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
	
	self.add(connectionTableView);	
	
	return self;
}
module.exports = ConnectionWindow;