exports.requestToUpdate = function() {

	var updateRequestDialog = Titanium.UI.createAlertDialog({
		title: L('Noonswoon'),
		message: L('An update for Noonswoon is available. Please download it now.'),
		buttonNames: [L('Later'), L('Download')],
		cancel: 0
	});

	updateRequestDialog.addEventListener('click', function(evt) {
		switch (evt.index) {
			case 1:
		        if (Ti.Android) {
		        	Ti.Platform.openURL('URL TO YOUR APP IN THE GOOGLE MARKETPLACE');
		        } else {
		        	Ti.API.info('redirect to apple itunes');
		        	Ti.Platform.openURL('https://itunes.apple.com/th/app/noonswoon/id605218289?ls=1&mt=8');
		        }
		       	break;
		}
	});
		
	updateRequestDialog.show();
};
