/**
 * Created by t_shanx on 5/24/2016.
 */
function initialize() {
    var auth = new MyAuthToken("PROD")
    console.log(auth.token);
    console.log(auth.tokenService);
    var value = auth.value();
    //console.log(value);
    var options = {

        env : 'AutodeskProduction',
        accessToken: value
        //you must provide token as url parameter: token=xxxxxxx
        //accessToken: Autodesk.Viewing.Private.getParameterByName("getToken()")

    };
    console.log(options.accessToken);
    // replace with your own urn
    var urn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YnVja2V0eDEvdGVzdEZ1c2lvbiUyMHYxLmYzZA==';

    Autodesk.Viewing.Initializer(options, function () {
        initializeViewer('viewer', urn, 'viewable');
    });
}

/*function getToken() {
    var theUrl = "http://localhost:5000/auth"; // change this when deploying
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);
    var resp =  JSON.parse(xmlHttp.responseText || null);
    var token = resp["access_token"];
    return token;
}*/

function MyAuthToken(env)
{
    if (env === "PROD") {
        this.tokenService = "http://localhost:5000/auth";
    }
    else if (env === "STG") {
        this.tokenService = "http://localhost:5000/auth-stg";
    }
    else if (env === "DEV") {
        this.tokenService = "http://localhost:5000/auth-dev";
    }
    else {
        alert("DEVELOPER ERROR: No valid environment set for MyAuthToken()");
    }

    this.token = "";
    this.expires_in = 0;
    this.timestamp = 0;
}

// FUNC value():
// return the value of the token

MyAuthToken.prototype.value = function()
{
    // if we've never retrieved it, do it the first time
    if (this.token === "") {
        console.log("AUTH TOKEN: Getting for first time...");
        this.get();
    }
    else {
        // get current timestamp and see if we've expired yet
        var curTimestamp = Math.round(new Date() / 1000);   // time in seconds
        var secsElapsed = curTimestamp - this.timestamp;

        if (secsElapsed > (this.expires_in - 10)) { // if we are within 10 secs of expiring, get new token
            console.log("AUTH TOKEN: expired, refreshing...");
            this.get();
        }
        else {
            var secsLeft = this.expires_in - secsElapsed;
            console.log("AUTH TOKEN: still valid (" + secsLeft + " secs)");
        }
    }

    return this.token;
};

// FUNC get():
// get the token from the Authentication service and cache it, along with the expiration time

MyAuthToken.prototype.get = function()
{
    var retVal = "";
    var expires_in = 0;

    var jqxhr = $.ajax({
        url: this.tokenService,
        type: 'GET',
        async: false,
        success: function(ajax_data) {
            console.log("AUTH TOKEN: " + ajax_data.access_token);
            retVal = ajax_data.access_token;  // NOTE: this only works because we've made the ajax call Synchronous (and "this" is not valid in this scope!)
            expires_in = ajax_data.expires_in;

        },
        error: function(jqXHR, textStatus) {
            alert("AUTH TOKEN: Failed to get new auth token!");
        }
    });

    this.token = retVal;
    this.expires_in = expires_in;
    this.timestamp = Math.round(new Date() / 1000);  // get time in seconds when we retrieved this token
};

function initializeViewer(containerId, documentId, role) {

    var viewerContainer = document.getElementById(containerId);

    var viewer = new Autodesk.Viewing.Private.GuiViewer3D(
        viewerContainer,
        { extensions: ['XiqiaoShanFirstExtension']});

    // extensions can also be loaded/unloaded using

    // viewer.loadExtension(extensionId, options);
    // viewer.unloadExtension(extensionId);

    viewer.start();

    viewer.impl.setLightPreset(8);
    console .log(viewer);
    Autodesk.Viewing.Document.load(documentId,

        function (doc) {
            var rootItem = doc.getRootItem();

            var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(
                rootItem,
                { 'type': 'folder', 'role': role },
                true);
            console.log(geometryItems[0]);
            console.log(doc);
            console.log(doc.getViewablePath(geometryItems[0]));
/*            if(geometryItems.length > 0){
                viewer.load(doc.getViewablePath(geometryItems[0]));
            }*/

        },
        // onErrorCallback
        function (msg) {
            console.log("Error: " + msg);
        }
    );
}

$(document).ready(function () {

    initialize();
});