/*
 * A good example of caching images to the device.
 */
 
/* example on how to use it
var win = Ti.UI.createWindow();
win.addEventListener("open", onOpen);
win.open();
 
function onOpen(e){ 
    get_remote_file("Wiki.png", "http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png", onComplete, onProgress)
}
 
function onComplete(file){
    var img = Ti.UI.createImageView({
        image:  file.path + file.file
    });
    win.add(img);
}
function onProgress(progress){
    TI.API.info("progress being made " + progress);
}
*/

var get_remote_file = function(filename, url, forced, fn_error, fn_progress, fn_complete)
{
    var file_obj = {file:filename, url:url + '/' + filename, path: null};
 
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
    if (file.exists() && forced == "0")
    {
        file_obj.path = Titanium.Filesystem.applicationDataDirectory+Titanium.Filesystem.separator;
        //fn_end(file_obj);
        if ( fn_complete ) fn_complete(filename);
    }
    else
    {
        if(Titanium.Network.online == true)
        {
            //alert('Going to download file now');
            var c = Titanium.Network.createHTTPClient();
            c.setTimeout(20000);
            c.onload = function(e)
            {
                //alert('onload ' + filename);
                if (c.status == 200 )
                {
                    var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
                    f.write(this.responseData);
                    f.remoteBackup = false;
                    file_obj.path = Titanium.Filesystem.applicationDataDirectory;
                    //fn_end(file_obj);
 
                    f = false;
                    //f = null;
                    file = null;
                }
                else
                {
		            file_obj.error = 'file not found'; // to set some errors codes
        	        alert('File not found');
            		n_end(file_obj);
                }
                if ( fn_complete ) {
                	Ti.API.info('complete download image');
                	fn_complete(filename);
                }
            };
            c.ondatastream = function(e)
            {
                //alert('ondatastream');
                if ( fn_progress ) fn_progress(e.progress);
            };
            c.onerror = function(e)
            {
                //alert('Error downloading file: ' + filename);
                file_obj.error = e.error;
                f = null;
                file = null;
                fn_error(file_obj);
            };
            c.open('GET',url + '/' + filename);
            //alert('about to send');
            c.send();           
        }
        else
        {
            file_obj.error = 'no internet';
            alert('No connectivity.. ');
            //fn_end(file_obj);
        }
    }
};