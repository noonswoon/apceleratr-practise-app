function readCallback(e) {
    if (e.bytesProcessed == -1)
    {
        // Error / EOF on socket. Do any cleanup here.
        Ti.API.info('error EOF on socket');
    }
    try {
        if(e.buffer) {
            var received = e.buffer.toString();
            Ti.API.info('Received: ' + received);
        } else {
            Ti.API.error('Error: read callback called with no buffer!');
        }
    } catch (ex) {
        Ti.API.error(ex);
    }
}

function writeCallback(e) {
    Ti.API.info('Successfully wrote to socket.: '+JSON.stringify(e));
}

exports.logEntryError = function(_errorMessage) {
	var logMessage =  Ti.App.LOGENTRIES_TOKEN +  " ERROR "+_errorMessage +"\n";
	Ti.API.info(logMessage);
	var socket = Ti.Network.Socket.createTCP({
	    host: 'api.logentries.com', port: 10000,
	    connected: function (e) {
	        Ti.Stream.pump(e.socket, readCallback, 1024, true);
	        Ti.Stream.write(socket, Ti.createBuffer({
	            value: logMessage
	        }), writeCallback);
	    },
	    error: function (e) {
	        Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
	    },
	});
	socket.connect();
};

exports.logEntryInfo = function(_infoMessage) {
	var logMessage =  Ti.App.LOGENTRIES_TOKEN +  " INFO "+_infoMessage +"\n";
	Ti.API.info(logMessage);
	var socket = Ti.Network.Socket.createTCP({
	    host: 'api.logentries.com', port: 10000,
	    connected: function (e) {
	        Ti.Stream.pump(e.socket, readCallback, 1024, true);
	        Ti.Stream.write(socket, Ti.createBuffer({
	            value: logMessage
	        }), writeCallback);
	    },
	    error: function (e) {
	        Ti.API.info('Error (' + e.errorCode + '): ' + e.error);
	    },
	});
	socket.connect();
};

exports.logSystemData = function(_level, _msg, _userId, _fbId) {
	var sendingObj = {}; 
	sendingObj.level = _level; 
	sendingObj.msg = _msg;
	sendingObj.user_id = _userId;
	sendingObj.fb_id = _fbId;
	sendingObj.mac_addr = Ti.Platform.id;
		
	Ti.API.info('Level: '+_level+', Msg: '+_msg+', userId: '+_userId);
	
	if(Ti.App.LIVE_DATA) {
		var url = Ti.App.API_SERVER +"log/save/";
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    	var resultObj = JSON.parse(this.responseText);
		    	if(resultObj.meta !== undefined && resultObj.meta.status == "ok") {
					Ti.API.info('logSystemData is working')
				}
		    },
		    onerror: function(e) {
				// this function is called when an error occurs, including a timeout
		    },
		    timeout:50000  // in milliseconds
		});
		xhr.open("POST", url);
		xhr.setRequestHeader('Authorization', 'Basic '+ Titanium.Utils.base64encode(Ti.App.API_ACCESS));
	 	xhr.setRequestHeader('Content-Type','application/json');
		xhr.send(JSON.stringify(sendingObj));  // request is actually sent with this statement		
	}
};