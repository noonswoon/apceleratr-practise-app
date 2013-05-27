CreditOverviewWindow = function() {
	
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

	var contentView = Ti.UI.createTableView({
		top:0,
		backgroundColor:'#eeeeee',
		separatorColor: 'transparent',
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
		text: 'Your Credits',
		top: 13,
		left: 54, 
		color: '#666666',
		font:{fontWeight:'bold',fontSize:18},
		zIndex: 3,
	});
	currentCreditBackground.add(yourCreditLabel);
	
	var creditAmoutLabel = Ti.UI.createLabel({
		text: '100',
		top: 12,
		right: 16, 
		color: '#e01124',
		font:{fontWeight:'bold',fontSize:20},
		zIndex: 3,
	});
	currentCreditBackground.add(creditAmoutLabel);
	yourCreditsSectionView.add(currentCreditBackground);
	
	var buyCreditButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/credits-big-btn-red.png', 
		backgroundFocusedImage: 'images/credit/credits-big-btn-red-active.png', 
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
	yourCreditsSectionView.add(buyCreditButton);
	
	var inviteFriendsButton = Ti.UI.createButton({
		width: 301, 
		height: 46,
		backgroundImage: 'images/credit/big-btn.png', 
		backgroundFocusedImage: 'images/credit/big-btn-active.png', 
		center: {x:'50%', y:153}, //x:67
		zIndex: 2,
	});
	
	var inviteFriendsButtonText = Ti.UI.createLabel({
		text: L('Invite Friends, get free credits'),
		color: '#636c78',
		shadowColor: '#ffffff',
		shadowOffset: {x:0, y:1},
		font:{fontWeight:'bold',fontSize:16},
		center: {x:'50%', y:'50%'},
		zIndex: 3,
	});
	inviteFriendsButton.add(inviteFriendsButtonText);	
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
		font:{fontWeight:'bold',fontSize:16},
		center: {x:'50%', y:26},
		zIndex: 3,
	});
	howCreditsUsedSectionView.add(howCreditsAreUsedLabel);
	
	var certainActionsLabel = Ti.UI.createLabel({
		text: L('Certain actions required credits'),
		color: '#a3a7ad',
		font:{fontSize:14},
		center: {x:'50%', y:50},
		zIndex: 3,
	});
	howCreditsUsedSectionView.add(certainActionsLabel);
	
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
		text: L('Use 5 credits to reveal Mutual Friends'),
		top: 108,
		left: 55,
		color: '#a3a7ad',
		font:{fontSize:14},
	});
	howCreditsUsedSectionView.add(mutualFriendDesc1);
	
	var mutualFriendDesc2 = Ti.UI.createLabel({
		text: L('5 credits'),
		top: 108,
		left: 75,
		color: '#4e5866',
		font:{fontWeight:'bold',fontSize:14},
		zIndex: 5
	});
	howCreditsUsedSectionView.add(mutualFriendDesc1);	
	
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

	var horizontalSeparator5 = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		bottom: 0,
		height: 2,
		width: '100%'
	});
	earnCreditsSectionView.add(horizontalSeparator5);
	earnCreditsRow.add(earnCreditsSectionView);
	tableData.push(earnCreditsRow);
	
	//summarize
	contentView.data = tableData;
	self.add(contentView);
	
/*	var getCreditsLabel = Ti.UI.createLabel({
		text: 'Get Credits',
		center: {x: '50%', y:27}, 
		color: '#8f8f8f',
		font:{fontWeight:'bold',fontSize:18},
		shadowColor: '#ffffff', 
		shadowOffset: {x:0, y:1}
	});
	self.add(getCreditsLabel);
	
	var startingOffset = 50;

	var topEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset, 
		height: 5,
		left: 0, 
		width: '100%', 
	});
	self.add(topEdgeBuyCreditsView);
	
	var tenCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 5, 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(tenCreditsView);
	
	var hundredCreditsView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 53, //+ 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(hundredCreditsView);
	
	var bottomEdgeBuyCreditsView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 101, //+ 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeBuyCreditsView);
	
	var centerOffset = 75; 
	
	var topEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-top-edge.png',
		top: startingOffset + 101 + centerOffset, //+ 5 + 48 + 48 + centerOffset
		height: 5,
		left: 0, 
		width: '100%', 
	});
	self.add(topEdgeSubscriptionView);
	
	var monthlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-info-white-row.png',
		top: startingOffset + 106 + centerOffset, //+5 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(monthlySubscriptionView);
	
	var yearlySubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/match-bottom-box.png',
		top: startingOffset + 154 + centerOffset, //101 + 5 + 48 
		height: 48,
		left: 0, 
		width: '100%', 
	});
	self.add(yearlySubscriptionView);
	
	var bottomEdgeSubscriptionView = Ti.UI.createView({
		backgroundImage: 'images/row-bottom-edge.png',
		top: startingOffset + 202 + centerOffset, //101 + 5 + 48 + 48 
		height: 5,
		left: 0, 
		width: '100%', 
	});	
	self.add(bottomEdgeSubscriptionView);
*/
	
	return self;
};

module.exports = CreditOverviewWindow;

