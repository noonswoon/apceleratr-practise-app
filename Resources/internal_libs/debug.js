var DO_ALERT_DIALOG = false;
exports.debug_print = function(printStr) {
	if(DO_ALERT_DIALOG) alert(printStr);
	else Ti.API.info(printStr);
};

exports.debug_log = function(log) {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'log.txt');
	if(!f.exists())
		f.createFile();

	f.write(f.read() + '\n');
	f.write(Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss--"));
	f.write(log);
	Ti.API.info('successfully log the file');
};

