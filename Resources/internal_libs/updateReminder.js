exports.requestToUpdate = function() {

	var updateRequestDialog = Titanium.UI.createAlertDialog({
		title: 'Noonswoon',
		message: 'We just release a new update. Please download it now.',
		buttonNames: ['Later', 'Download'],
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
