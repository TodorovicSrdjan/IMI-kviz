function createCookie(key, value, date) {
    var expiration = date.toUTCString();
    var cookie = escape(key) + "=" + escape(value) + ";expires="
                    + expiration + ";sameSite=Lax;";
    document.cookie = cookie;
    console.log(cookie);
    console.log("Creating new cookie with key: " + key + " value: " + value + " expiration: " + expiration);
}

function readCookie(name) {
    var key = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
            if (cookie.indexOf(key) === 0) {
            return cookie.substring(key.length, cookie.length);
        }
    }
    return null;
}

function getCookieValues() {
    var values = [];
    var cookies = document.cookie.split(';');
    var regex = new RegExp(/^[0-9]+$/)
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        
        var value = cookie.split('=')[1];
        
        if( regex.test(value) )
            values.push( value );
    }
    return values;
}