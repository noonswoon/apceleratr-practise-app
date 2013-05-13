exports.checkReminderToRate = function(_userId) {
 	var numberOfUsage = Ti.App.Properties.getInt('numberOfUsage');

	var rateRequestDialog = Titanium.UI.createAlertDialog({
		title: L('Thank you for your love!'),
		message: L('Please rate Noonswoon 5 stars in the App Store'),
		buttonNames: [L('No, thanks'), L('Rate 5 stars')],
		cancel: 0
	});

	rateRequestDialog.addEventListener('click', function(evt) {
		switch (evt.index) {
			case 0:
				Ti.App.Properties.setInt('numberOfUsage', -1);
		        break;
		    case 1:
		    	Ti.App.Properties.setInt('numberOfUsage', -1); //did the review (hopefully!)
		        if (Ti.Android) {
		        	Ti.Platform.openURL('URL TO YOUR APP IN THE GOOGLE MARKETPLACE');
		        } else {
		        	Ti.Platform.openURL('https://itunes.apple.com/th/app/noonswoon/id605218289?ls=1&mt=8');
		        }
		       	break;
		    case 2:
		}
	});
		
	var enjoyUsingDialog = Titanium.UI.createAlertDialog({
		title: L('Welcome back!'),
		message: L('Are you enjoying Noonswoon?'),
		buttonNames: [L('It\'s ok'), L('I love it!')],
		cancel: 0
	});
	
	enjoyUsingDialog.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'android' && enjoyUsingDialog.buttonNames === null) {
			Ti.API.info('(There was no button to click)');
		} else {
			if(e.index === 1) { //continue showing the rating
				rateRequestDialog.show();
			} else { //clicking it's ok
				Ti.App.Properties.setInt('numberOfUsage', -1);
				//show email
				var emailDialog = Ti.UI.createEmailDialog()
				emailDialog.subject = L("Suggestion");
				emailDialog.toRecipients = ['suggestion@noonswoon.com'];
				emailDialog.messageBody = L('Please let us know how we can make Noonswoon better.') + '\n\n\n\n\n\n(UserId: '+_userId + ')';
				emailDialog.barColor = '#850f16';
				emailDialog.open();
			}
		}	
	});
	 		        
    if (!numberOfUsage) {
        Ti.App.Properties.setInt('numberOfUsage', 1);
    } else {
        if(numberOfUsage !== -1) { //if it is -1, never remind the user again
	        if(numberOfUsage >= 5 && numberOfUsage % 5 === 0) {
		        //show if you enjoy or not
		        enjoyUsingDialog.show();        	
	        }
	        Ti.App.Properties.setInt('numberOfUsage', numberOfUsage + 1);
        } //end if !== -1
    }	
};
