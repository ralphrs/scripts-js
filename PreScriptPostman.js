{{var getToken = true;
var OAUTH_URL = pm.environment.get("apim-host");
var OAUTH_BASIC = pm.environment.get("OAUTH_BASIC");
var OAUTH_USERNAME = pm.environment.get("OAUTH_USERNAME");
var OAUTH_PASSWORD = pm.environment.get("OAUTH_PASSWORD");
console.log('## ENVIRONMENNT ##');
console.log('OAUTH_URL: ' + OAUTH_URL);
console.log('OAUTH_BASIC: ' + OAUTH_BASIC);
console.log('OAUTH_USERNAME: ' + OAUTH_USERNAME);
console.log('OAUTH_PASSWORD: ' + OAUTH_PASSWORD);
if (!pm.environment.get('accessTokenExpiry') || 
    !pm.environment.get('currentAccessToken')) {
        
    console.log('Token or expiry date are missing')
} else if (pm.environment.get('accessTokenExpiry') <= (new Date()).getTime()) {
    console.log('Token is expired')
} else {
    getToken = false;
    console.log('Token and expiry date are all good');
}
if (getToken === true) {
    pm.sendRequest({
        url:  OAUTH_URL + "/token", 
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': OAUTH_BASIC
        },
        body: {
            mode: 'urlencoded',
            urlencoded: [
                {key: "grant_type", value: "password", disabled: false},
                {key: "username", value: OAUTH_USERNAME, disabled: false},
                {key: "password", value: OAUTH_PASSWORD, disabled: false}
            ]
        }
    }, function (err, res) {
        console.log(err ? err : res.json());
        if (err === null) {
            console.log('Saving the token and expiry date')
            var responseJson = res.json();
            pm.environment.set('currentAccessToken', res.json().access_token)
    
            var expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + res.json().expires_in);
            pm.environment.set('accessTokenExpiry', expiryDate.getTime());
        }        
    });  
        
}}}
