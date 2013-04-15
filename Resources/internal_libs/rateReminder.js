exports.checkReminderToRate = function() {
 	var numberOfUsage = Ti.App.Properties.getInt('numberOfUsage');

	var rateRequestDialog = Titanium.UI.createAlertDialog({
		title: 'Show us some love!',
		message: 'Please take a moment to rate Noonswoon',
		buttonNames: ['OK', 'Remind Me Later', 'Never'],
		cancel: 2
	});

	rateRequestDialog.addEventListener('click', function(evt) {
		switch (evt.index) {
			case 0:
		    	Ti.App.Properties.setInt('numberOfUsage', -1); //did the review (hopefully!)
		        if (Ti.Android) {
		        	Ti.Platform.openURL('URL TO YOUR APP IN THE GOOGLE MARKETPLACE');
		        } else {
		        	Ti.Platform.openURL('https://itunes.apple.com/th/app/noonswoon/id605218289?ls=1&mt=8');
		        }
		        Ti.App.Properties.setInt('numberOfUsage', -1); //once open, never show again
		       	break;
		    case 1:
		    	// "Remind Me Later"? Ok, we'll remind them tomorrow when they launch the app.
		        Ti.App.Properties.setInt('numberOfUsage', numberOfUsage + 1);
		        break;
		    case 2:
		    	Ti.App.Properties.setInt('numberOfUsage', -1);
		        break;
		}
	});
		
	var enjoyUsingDialog = Titanium.UI.createAlertDialog({
		title: L('Feedback'),
		message: L('Do you enjoy using Noonswoon?'),
		buttonNames: [L('No'), L('Very much')],
		cancel: 0
	});
	
	enjoyUsingDialog.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'android' && enjoyUsingDialog.buttonNames === null) {
			Ti.API.info('(There was no button to click)');
		} else {
			if(e.index === 1) { //continue showing the rating
				rateRequestDialog.show();
			}
		}	
	});
		        		        
    if (!numberOfUsage) {
        Ti.App.Properties.setInt('numberOfUsage', 1);
    } else {
        if(numberOfUsage !== -1) { //if it is -1, never remind the user again
	        if(numberOfUsage >= 5 && numberOfUsage % 5 == 0) {
		        //show if you enjoy or not
		        enjoyUsingDialog.show();        	
	        } else {
	        	Ti.App.Properties.setInt('numberOfUsage', numberOfUsage + 1);
	        }
        } //end if !== -1
    }	
};
