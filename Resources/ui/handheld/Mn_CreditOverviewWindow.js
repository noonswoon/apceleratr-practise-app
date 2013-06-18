CreditOverviewWindow = function(_navGroup, _userId) {
	var CreditBuyingWindowModule = require('ui/handheld/Mn_CreditBuyingWindow');
	var CreditSystem = require('internal_libs/creditSystem');
	var InviteFriendWindowModule = require('ui/handheld/Mn_InviteFriendWindow');
		
	var backButton = Ti.UI.createButton({
		backgroundImage: 'images/top-bar-button.png',
		color: '#f6f7fa',
		width: 44,
		height: 30,
		image: 'images/topbar-glyph-back.png',
	});
	
	var self = Ti.UI.createWindow({
		title: 'Credits',
		left: 0,
		navBarHidden: false,
		barImage: 'images/top-bar-stretchable.png',
		backgroundColor: '#eeeeee',
		leftNavButton: backButton
	});

	backButton.addEventListener('click', function() {
		_navGroup.close(self, {animated:true}); //go to the main screen
	});
	
	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
		separatorColor: 'transparent',
		scrollable: false //set to true if there is more content
		//width:'100%',
	});
	if(Ti.Platform.osname === 'iphone')
		contentView.separatorStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
				
	var tableData = [];
	
	//****************** Your credit/buy/invite friends section ****************************************************
	var yourCreditsRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 200,
	});
	if(Ti.Platform.osname === 'iphone')
		yourCreditsRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
			
	var yourCreditsSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 200,
	});

	var currentCreditBackground = Ti.UI.createImageView({
		image: 'images/credit/credits-label-bg.png',
		top: 15, 
		left: 8,
		height: 46,
		width: 302,
		zIndex: 2
	});
	
	var creditGlyph = Ti.UI.createImageView({
		image: 'images/credit/credits-glyph.png',
		top: 12,
		left: 16,
		width: 23, 
		height: 24,
		zIndex: 3,
	});
	currentCreditBackground.add(creditGlyph);
	
	var yourCreditLabel = Ti.UI.createLabel({
		text: L('Your Credits'),
		top: 13,
		left: 54, 
		color: '#666666',
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3,
	});
	currentCreditBackground.add(yourCreditLabel);
	
	var creditAmountLabel = Ti.UI.createLabel({
		text: CreditSystem.getUserCredit(),
		top: 12,
		right: 16, 
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		zIndex: 3,
	});
	currentCreditBackground.add(creditAmountLabel);
	yourCreditsSectionView.add(currentCreditBackground);
	
	var buyCreditButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/credits-big-btn-red.png', 
		backgroundSelectedImage: 'images/credit/credits-big-btn-red-active.png', 
		center: {x:'50%', y:98}, //x:67
		zIndex: 2,
	});
	
	var buyCreditButtonText = Ti.UI.createLabel({
		text: L('Buy Credits'),
		color: '#eff2f7',
		shadowColor: '#590a10',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	buyCreditButton.add(buyCreditButtonText);	

	buyCreditButton.addEventListener('click', function() {
		var creditBuyingWindow = new CreditBuyingWindowModule(_navGroup, _userId);
		_navGroup.open(creditBuyingWindow);
	});

	yourCreditsSectionView.add(buyCreditButton);
	
	var inviteFriendsButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundSelectedImage: 'images/credit/big-btn-active.png', 
		center: {x:'50%', y:153}, //x:67
		zIndex: 2,
	});
	
	var inviteFriendsButtonText = Ti.UI.createLabel({
		text: L('Get Free Credits'),
		color: '#636c78',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	inviteFriendsButton.add(inviteFriendsButtonText);	

	inviteFriendsButton.addEventListener('click', function() {
		var inviteFriendWindow = new InviteFriendWindowModule(_navGroup, _userId, false);
		_navGroup.open(inviteFriendWindow);
	});
		
	yourCreditsSectionView.add(inviteFriendsButton);	
	
	var horizontalSeparator1 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		bottom: 0,
		height: 2,
		width: '100%'
	});
	yourCreditsSectionView.add(horizontalSeparator1);
	yourCreditsRow.add(yourCreditsSectionView);
	tableData.push(yourCreditsRow);	

	// ************************** How credits are used section ****************************************************
	var howCreditsRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 210,
	});
	
	if(Ti.Platform.osname === 'iphone')
		howCreditsRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var howCreditsUsedSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 210,
	});
	
	var howCreditsAreUsedLabel = Ti.UI.createLabel({
		text: L('How Credits Are Used'),
		color: '#919191',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:18},
		center: {x:'50%', y:'35'},
//		center: {x:'50%', y:26}, //if there is 2 lines use this location; with fontSize 16
		zIndex: 3,
	});
	howCreditsUsedSectionView.add(howCreditsAreUsedLabel);

/*	
	var certainActionsLabel = Ti.UI.createLabel({
		text: L('Certain actions required credits'),
		color: '#a3a7ad',
		font:{fontSize:14},
		center: {x:'50%', y:50},
		zIndex: 3,
	});
	howCreditsUsedSectionView.add(certainActionsLabel);
*/
	
	var horizontalArrowDown1 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-arrow-down-separator.png',
		top: 70, 
		left: 0,
		width: 320, 
		height: 13
	});
	howCreditsUsedSectionView.add(horizontalArrowDown1);
	
	var mutualFriendGlyph = Ti.UI.createImageView({
		image: 'images/credit/mutual-friends-glyph.png',
		top: 98,
		left: 15,
		width: 26, 
		height: 17
	});
	howCreditsUsedSectionView.add(mutualFriendGlyph);
	
	var mutualFriendTopic = Ti.UI.createLabel({
		text: L('Mutual Friends'),
		color: '#666666',
		top: 88, //70+18 
		left: 55,
		font:{fontWeight:'bold',fontSize:16},
	});
	howCreditsUsedSectionView.add(mutualFriendTopic);
	
	var mutualFriendDesc1 = Ti.UI.createLabel({
		text: L('Use'),
		top: 112,
		left: 55,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	howCreditsUsedSectionView.add(mutualFriendDesc1);
	
	var mutualFriendDesc2 = Ti.UI.createLabel({
		text: L('5 credits'),
		top: 112,
		left: 84,
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:14},
	});
	howCreditsUsedSectionView.add(mutualFriendDesc2);	
	
	var mutualFriendDesc3 = Ti.UI.createLabel({
		text: L('to reveal mutual friends'),
		top: 112,
		left: 145,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	howCreditsUsedSectionView.add(mutualFriendDesc3);	
	
	var horizontalSeparator2 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 143,
		height: 2,
		width: '100%'
	});
	howCreditsUsedSectionView.add(horizontalSeparator2);
	
	var likeGlyph = Ti.UI.createImageView({
		image: 'images/credit/like-glyph.png',
		top: 166,
		left: 15,
		width: 20, 
		height: 24
	});
	howCreditsUsedSectionView.add(likeGlyph);
	
	var likeTopic = Ti.UI.createLabel({
		text: L('Like'),
		color: '#666666',
		top: 156, 
		left: 55,
		font:{fontWeight:'bold',fontSize:16},
	});
	howCreditsUsedSectionView.add(likeTopic);
	
	var likeDesc1 = Ti.UI.createLabel({
		text: L('Use'),
		top: 180,
		left: 55,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	howCreditsUsedSectionView.add(likeDesc1);
	
	var likeDesc2 = Ti.UI.createLabel({
		text: L('10 credits'),
		top: 180,
		left: 84,
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:14},
	});
	howCreditsUsedSectionView.add(likeDesc2);	
	
	var likeDesc3 = Ti.UI.createLabel({
		text: L('to like your match'),
		top: 180,
		left: 154,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	howCreditsUsedSectionView.add(likeDesc3);	
	
	var horizontalSeparator3 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		bottom: 0,
		height: 2,
		width: '100%'
	});
	howCreditsUsedSectionView.add(horizontalSeparator3);
	howCreditsRow.add(howCreditsUsedSectionView);
	tableData.push(howCreditsRow);
	
	// ************************** earned free credits section ****************************************************
/*
	var earnCreditsRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 210,
	});
	
	if(Ti.Platform.osname === 'iphone')
		earnCreditsRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var earnCreditsSectionView = Ti.UI.createView({
		backgroundColor: '#eeeeee', //#eeeeee 
		top: 0,
		left: 0,
		height: 210,
	});
	
	var earnLabel = Ti.UI.createLabel({
		top: 16, 
		left: 93,
		text: L('Earn'),
		color: '#919191',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 3,
	});
	earnCreditsSectionView.add(earnLabel);
	
	var freeCreditsLabel = Ti.UI.createLabel({
		top: 16, 
		left: 133,
		text: L('Free Credits'),
		color: '#e01124',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		zIndex: 4,
	});
	earnCreditsSectionView.add(freeCreditsLabel);
	
	var getCreditsUsingLabel = Ti.UI.createLabel({
		text: L('Get credits using Noonswoon'),
		color: '#a3a7ad',
		font:{fontSize:14},
		center: {x:'50%', y:50},
		zIndex: 3,
	});
	earnCreditsSectionView.add(getCreditsUsingLabel);
	
	var horizontalArrowDown2 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-arrow-down-separator.png',
		top: 70, 
		left: 0,
		width: 320, 
		height: 13
	});
	earnCreditsSectionView.add(horizontalArrowDown2);
	
	var dailyGlyph = Ti.UI.createImageView({
		image: 'images/credit/daily-glyph.png',
		top: 98,
		left: 15,
		width: 25, 
		height: 25
	});
	earnCreditsSectionView.add(dailyGlyph);
	
	var loginDailyTopic = Ti.UI.createLabel({
		text: L('Daily Login'),
		color: '#666666',
		top: 88, 
		left: 55,
		font:{fontWeight:'bold',fontSize:16},
	});
	earnCreditsSectionView.add(loginDailyTopic);

	var dailyCreditDesc1 = Ti.UI.createLabel({
		text: L('Get'),
		top: 112,
		left: 55,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	earnCreditsSectionView.add(dailyCreditDesc1);
	
	var dailyCreditDesc2 = Ti.UI.createLabel({
		text: L('1 daily credit'),
		top: 112,
		left: 84,
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:14},
	});
	earnCreditsSectionView.add(dailyCreditDesc2);	
	
	var dailyCreditDesc3 = Ti.UI.createLabel({
		text: L('for using Noonswoon'),
		top: 112,
		left: 175,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	earnCreditsSectionView.add(dailyCreditDesc3);
		
	var horizontalSeparator4 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 143,
		height: 2,
		width: '100%'
	});
	earnCreditsSectionView.add(horizontalSeparator4);
	
	var inviteGlyph = Ti.UI.createImageView({
		image: 'images/credit/invite-friends-glyph.png',
		top: 166,
		left: 15,
		width: 25, 
		height: 25
	});
	earnCreditsSectionView.add(inviteGlyph);

	var inviteTopic = Ti.UI.createLabel({
		text: L('Friend Invites'),
		color: '#666666',
		top: 156, 
		left: 55,
		font:{fontWeight:'bold',fontSize:16},
	});
	earnCreditsSectionView.add(inviteTopic);

	var inviteDesc1 = Ti.UI.createLabel({
		text: L('Get'),
		top: 180,
		left: 55,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	earnCreditsSectionView.add(inviteDesc1);
	
	var inviteDesc2 = Ti.UI.createLabel({
		text: L('2 credits'),
		top: 180,
		left: 84,
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:14},
	});
	earnCreditsSectionView.add(inviteDesc2);	
	
	var inviteDesc3 = Ti.UI.createLabel({
		text: L('for each friend you invite'),
		top: 180,
		left: 145,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	earnCreditsSectionView.add(inviteDesc3);
	
	var horizontalSeparator5 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		bottom: 0,
		height: 2,
		width: '100%'
	});
	earnCreditsSectionView.add(horizontalSeparator5);
	earnCreditsRow.add(earnCreditsSectionView);
	tableData.push(earnCreditsRow);
*/	
	//summarize
	contentView.data = tableData;
	self.add(contentView);
	
	var creditChangeCallback = function(e) {
		creditAmountLabel.text = e.currentCredit;	
	};	
	Ti.App.addEventListener('creditChange', creditChangeCallback); 

	self.addEventListener('close', function() {
		Ti.App.removeEventListener('creditChange', creditChangeCallback); 
	});

	return self;
};

module.exports = CreditOverviewWindow;

