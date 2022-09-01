const ERROR_ACCESS_TOKEN = "The access token has expired! Press Get Access Token to get another one";
const ERROR_UNKNOWN = "An unspecified error has occured...";
const ERROR_NOMARKS = "Please select at least one song to mark by clicking the Heart button";
const ERROR_TOOMANYMARKS = "There can only be up to 5 marks. Please remove some of the marks";
const ERROR_INVALIDSECRET = "Invalid Secret Key";
const ERROR_INVALIDCLIENT = "Invalid Client Key";
const SUCCESS_ACCESSTOKENGOT = "Successfully obtained an access key (Basic). This only lasts for 1 hour before reobtaining access key";
const SUCCESS_ACCESSTOKENGOT2 = "Successfully obtained an access key (Credentials). This only lasts for 1 hour before reobtaining access key";
const ERROR_AUTHCODEEXPIRED = "Authorization Code has expired, please reverify by clicking Request Permission."
const ERROR_LOGINREQUIRED = "This only works with Credentials access. Click Use Credentials and then Get Access Token to access user account.";
const SUCCESS_ADDTOPLAYLIST = "Successfully saved the list of songs onto a playlist";
const setTime = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    let ms = Math.floor((time - Math.floor(time)) * 1000);
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ":" + sec + "." + ms;
}

function authorizationCode() {
    window.open('https://accounts.spotify.com/authorize?' + serialize(
        {
            client_id: localStorage.getItem("clientKey"),
            response_type: 'code',
            redirect_uri: document.getElementById("redirectUri").value,
            scope: `ugc-image-upload user-modify-playback-state 
            user-read-playback-state user-read-currently-playing 
            user-follow-modify user-follow-read user-read-recently-played user-top-read
            playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private
            app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read`

        }), '_blank');
}

function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

async function requestPermission() {
    authorizationCode();
}

async function getAccessToken() {
    if (document.getElementById("auth1").checked == true) {
        //Form needs to be urlencoded since our content-type is set to urlencoded
        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");

        //Use Client credentials
        let getData = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: urlencoded,
            headers: {
                "Authorization": 'Basic ' + btoa(localStorage.getItem("clientKey") + ':' + localStorage.getItem("secretKey")),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                response.json().then(function (json) {
                    if (json.hasOwnProperty("access_token")) {
                        localStorage.setItem("spotify_access_token", json["access_token"]);
                        localStorage.setItem("spotify_token_type", json["token_type"]);
                        localStorage.setItem("spotify_auth_type", "client_credentials");
                        const today = new Date();
                        today.setSeconds(today.getSeconds() + json["expires_in"]);
                        localStorage.setItem("spotify_expires_client", today.getTime());
                        alert(SUCCESS_ACCESSTOKENGOT);
                    } else {
                        processError(json);
                    }
                });
            });
    } else if (document.getElementById("auth2").checked == true) {

        //Current time is past expiration date and also we do have a refresh token
        if (( localStorage.getItem("spotify_expires_authCode") == null || new Date().getTime() > localStorage.getItem("spotify_expires_authCode")) && localStorage.getItem("spotify_refresh") === null) {
            //Form needs to be urlencoded since our content-type is set to urlencoded
            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "authorization_code");
            urlencoded.append("code", localStorage.getItem("authCode"));
            urlencoded.append("redirect_uri", window.location);
            //Use Client credentials
            let getData = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                body: urlencoded,
                headers: {
                    "Authorization": 'Basic ' + btoa(localStorage.getItem("clientKey") + ':' + localStorage.getItem("secretKey")),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then((response) => {
                    response.json().then(function (json) {
                        if (json.hasOwnProperty("access_token")) {
                            localStorage.setItem("spotify_access_token", json["access_token"]);
                            localStorage.setItem("spotify_token_type", json["token_type"]);
                            localStorage.setItem("spotify_auth_type", "authorization_code");
                            const today = new Date();
                            today.setSeconds(today.getSeconds() + json["expires_in"]);
                            localStorage.setItem("spotify_expires_authCode", today.getTime());
                            localStorage.setItem("spotify_refresh", json["refresh_token"]);

                            alert(SUCCESS_ACCESSTOKENGOT2);
                        } else {
                            console.log(json);
                            processError(json);
                        }
                    });
                });
        }
        else { //Use a refresh token instead given by first authorization code flow.

            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "refresh_token");
            urlencoded.append("refresh_token", localStorage.getItem("spotify_refresh"));
            //Refresh Token
            let getData = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                body: urlencoded,
                headers: {
                    "Authorization": 'Basic ' + btoa(localStorage.getItem("clientKey") + ':' + localStorage.getItem("secretKey")),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then((response) => {
                    response.json().then(function (json) {
                        if (json.hasOwnProperty("access_token")) {
                            localStorage.setItem("spotify_access_token", json["access_token"]);
                            localStorage.setItem("spotify_token_type", json["token_type"]);
                            localStorage.setItem("spotify_auth_type", "authorization_code");
                            const today = new Date();
                            today.setSeconds(today.getSeconds() + json["expires_in"]);
                            localStorage.setItem("spotify_expires_authCode", today.getTime());
                            localStorage.removeItem("spotify_refresh");

                            alert(SUCCESS_ACCESSTOKENGOT2);
                        } else {
                            console.log(json);
                            processError(json);
                        }
                    });
                });
        }
    }
}

function clientKeyChanged() {
    localStorage.setItem("clientKey", document.getElementById("clientID").value);
}

function secretKeyChanged() {
    localStorage.setItem("secretKey", document.getElementById("clientSecret").value);
}
function authCodeChanged() {
    localStorage.setItem("authCode", document.getElementById("authCode").value);
}
function userIDChanged() {
    localStorage.setItem("userID", document.getElementById("userID").value);
}
//Is called when document is ready.
$(document).ready(function () {
    if (localStorage.getItem("clientKey") != null) {
        $("#clientID").prop("value", localStorage.getItem("clientKey"));
    }
    if (localStorage.getItem("secretKey") != null) {
        $("#clientSecret").prop("value", localStorage.getItem("secretKey"));
    }
    if (localStorage.getItem("authCode") != null) {
        $("#authCode").prop("value", localStorage.getItem("authCode"));
    }
    if (localStorage.getItem("userID") != null) {
        $("#userID").prop("value", localStorage.getItem("userID"));
    }
    if (localStorage.getItem("spotify_auth_type") == "client_credentials") {
        $("#auth1").prop("checked", true);
    }
    if (localStorage.getItem("spotify_auth_type") == "authorization_code") {
        $("#auth2").prop("checked", true);
    }

       $("#redirectUri").prop("value", window.location);
   
});

function processError(error) {
    if (error.hasOwnProperty("status")) {
        switch (error.status) {
            case 401:
                alert(ERROR_ACCESS_TOKEN);
                break;
            default:
                alert(ERROR_UNKNOWN + " Error Code: " + error.status + "-" + error.message);
                break;
        }
    }
    else if (error.hasOwnProperty("error")) {
        switch (error.error) {
            case "invalid_client": {
                if (error.error_description == 'Invalid client secret')
                    alert(ERROR_INVALIDSECRET);
                else if (error.error_description == 'Invalid client key')
                    alert(ERROR_INVALIDCLIENT);
            }
            case "invalid_grant": {
                if (error.error_description ="Authorization code expired") {
                    alert(ERROR_AUTHCODEEXPIRED);
                }
            }
        }
    } else {
        alert(ERROR_UNKNOWN);
    }
}