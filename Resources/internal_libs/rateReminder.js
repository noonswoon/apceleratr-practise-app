exports.checkReminderToRate = function() {
 	var numberOfUsage = Ti.App.Properties.getInt('numberOfUsage');

    if (!numberOfUsage) {
        Ti.App.Properties.setInt('numberOfUsage', 1);
    } else {
        if(numberOfUsage !== -1) { //if it is -1, never remind the user again
	        if(numberOfUsage >= 5 && numberOfUsage % 5 == 0) {
		        var alertDialog = Titanium.UI.createAlertDialog({
		            title: 'Show us some love!',
		            message: 'Please take a moment to rate Noonswoon',
		            buttonNames: ['OK', 'Remind Me Later', 'Never'],
		            cancel: 2
		        });
		        alertDialog.addEventListener('click', function(evt) {
		            switch (evt.index) {
		                case 0:
		                    Ti.App.Properties.setInt('numberOfUsage', -1); //did the review (hopefully!)
		                    // NOTE: replace this with your own iTunes link; also, this won't WON'T WORK IN THE SIMULATOR!
		                    if (Ti.Android) {
		                        Ti.Platform.openURL('URL TO YOUR APP IN THE GOOGLE MARKETPLACE');
		                    } else {
		                        Ti.Platform.openURL('https://itunes.apple.com/us/app/noonswoon/id602072151?ls=1&mt=8'); //TODO: change this to the actual URL when submit to appstore!!!
		                    }
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
		        alertDialog.show();        	
	        } else {
	        	Ti.App.Properties.setInt('numberOfUsage', numberOfUsage + 1);
	        }
        } //end if !== -1
    }	
};
