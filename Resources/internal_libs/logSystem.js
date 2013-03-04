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

exports.logEntry = function(_errorMessage) {
	var logMessage =  Ti.App.LOGENTRIES_TOKEN +  "ERROR "+_errorMessage;
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
