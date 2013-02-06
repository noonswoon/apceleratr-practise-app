MutualFriendsWindow = function(_navGroup, _mutualFriendsArray) {
		
	var MutualFriendTableViewRow = require('ui/handheld/Mn_MutualFriendTableViewRow');
	
	var emptyView = Titanium.UI.createView({});

	var backButton = Ti.UI.createButton({
			backgroundImage: 'images/top-bar-button.png',
			color: '#f6f7fa',
			width: 44,
			height: 30,
			image: 'images/topbar-glyph-back.png'
		});
		
	var self = Titanium.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		title: L('Mutual Friends'),
		navBarHidden: false,
		leftNavButton: backButton,
		backgroundColor: '#eeeeee'
	});
	
	var isScrollable = false; 
	if(_mutualFriendsArray.length >= 9) isScrollable = true;
	
	var mutualFriendTableView = Ti.UI.createTableView({
		top: 0,
		width: '100%',
		height: _mutualFriendsArray.length * 50,
		scrollable: isScrollable
	});	
	
	var createTable = function(_personList) {
		var tableData = [];
		for(var i = 0; i<_personList.length;i++) {
			var curPersonFbId = _personList[i];
			var personRow = new MutualFriendTableViewRow(curPersonFbId);
			tableData.push(personRow);
		}
		return tableData;
	};
	
	var mutualFriendTableRowData = createTable(_mutualFriendsArray);
	if(_mutualFriendsArray.length >= 9) {
		var EmptyTableViewRow = require('ui/handheld/Mn_EmptyTableViewRow');
		var emptyRow = new EmptyTableViewRow()
		mutualFriendTableRowData.push(emptyRow);
	}
	
	mutualFriendTableView.setData(mutualFriendTableRowData);

	self.add(mutualFriendTableView);

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	return self;
}
module.exports = MutualFriendsWindow;
