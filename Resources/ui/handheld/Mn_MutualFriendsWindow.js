MutualFriendsWindow = function(_navGroup, _mutualFriendsArray, _isLatestMatch) {
	Ti.App.GATracker.trackScreen("MutualFriendsScreen");
	var ModelFacebookFriend = require('model/facebookFriend');
	
	var emptyView = Titanium.UI.createView({});

	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/edit/topbar-glyph-cancel.png'
	});
		
	var self = Titanium.UI.createWindow({
		barImage: 'images/top-bar-stretchable.png',
		title: L('Mutual Friends'),
		navBarHidden: false,
		leftNavButton: backButton,
		backgroundColor: '#eeeeee',
		height: '100%'
	});
	
	var isScrollable = false; 
	var listViewHeight =  _mutualFriendsArray.length * 50;
	if(_mutualFriendsArray.length >= 9) {
		isScrollable = true;
		listViewHeight = '100%';
	}
	
	var mutualFriendTemplate = {
		properties: {
			selectionStyle: Ti.UI.iPhone.ListViewCellSelectionStyle.NONE
		},
		childTemplates: [
			{
				type: 'Ti.UI.ImageView', 
				bindId: 'friendImage', 
				properties: {
					left: 6, 
					width: 35, 
					height: 35, 
					touchEnabled: false, 
					borderWidth: 1, 
					borderRadius: 2, 
					borderColor: '#d5d5d5',
				}
			}, 
			{
				type: 'Ti.UI.Label', 
				bindId: 'friendName', 
				properties: {
					top: 10,
					left: 50, 
					color: '#595959',
					font: {fontSize: 15, fontWeight: 'bold'}
				}
			}
		]
	};

	var mutualFriendListView = Ti.UI.createListView({
		top: 0, 
		left: 0,
		backgroundColor: '#eeeeee',
		height: listViewHeight,
		templates: {'mutualFriendTemplate': mutualFriendTemplate}, 
		defaultItemTemplate: 'mutualFriendTemplate',
	});

	var listSection = null;
	
	//create data
	var mutualFriendsData = [];
	var numMutualFriendsToLoad = _mutualFriendsArray.length;
	
	showPreloader(self, L('Loading...'));
	for(var i = 0; i < _mutualFriendsArray.length; i++) {
		var fbId = _mutualFriendsArray[i];
		var imageUrl = 'http://graph.facebook.com/'+fbId+'/picture?type=square';
		var name = ModelFacebookFriend.getNameByFacebookId(fbId);
		if(name !== "") {
			numMutualFriendsToLoad--;
			Ti.API.info('get name caching data');
			mutualFriendsData.push({
				friendImage: { image: imageUrl},
				friendName: { text: name}
			});
			if(numMutualFriendsToLoad <= 0)  {
				hidePreloader(self);	
			}
		} else { //don't have data..request from fbGraph
			Ti.API.info('no data caching..getting fb graph info coz cannot find user locally');
			(function() {
				var curFbId = fbId;
				var curImageUrl = 'http://graph.facebook.com/'+curFbId+'/picture?type=square';
				Ti.App.Facebook.requestWithGraphPath(curFbId, {}, 'GET', function(e) {
					if (e.success) {
					    var fbGraphObj = JSON.parse(e.result);  //convert json text to javascript object	
					  	var curName = fbGraphObj.first_name + ' ' + fbGraphObj.last_name;
					   	
					   	//Ti.API.info('name: '+curName+', url: '+curImageUrl);
					   	mutualFriendsData.push({
							friendImage: { image: curImageUrl},
							friendName: { text: curName}
						});
						listSection.items = mutualFriendsData; //re-display again
						
						//do the update to the local database
						var userLocation = "";
						if(fbGraphObj.location !== undefined && fbGraphObj.location.name !== null) {
							userLocation = 	fbGraphObj.location.name;
						}
						ModelFacebookFriend.updateFacebookFriendName(curFbId, curName, curImageUrl, userLocation); 
					} else if (e.error) {
						Ti.App.LogSystem.logSystemData('error', 'MutualFriendsWindow GraphPath Error#1: '+JSON.stringify(e), null, Ti.App.Facebook.uid);
					} else {
						Ti.App.LogSystem.logSystemData('error', 'MutualFriendsWindow GraphPath Error#2: '+JSON.stringify(e), null, Ti.App.Facebook.uid);
					}
					numMutualFriendsToLoad--;
					if(numMutualFriendsToLoad <= 0)  {
						hidePreloader(self);	
					}
				});
			})();
		}
	}

	//create section
	listSection = Ti.UI.createListSection({items: mutualFriendsData});
	mutualFriendListView.sections = [listSection];
	self.add(mutualFriendListView);

	backButton.addEventListener('click', function() {
		Ti.App.fireEvent('closeMutualFriendsWindow', {isLatestMatch: _isLatestMatch});
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	return self;
};
module.exports = MutualFriendsWindow;
