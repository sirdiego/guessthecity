var map, toggle, center, zoom;
var button = document.getElementById('toggle');
var passphrase = "sosecretsowowmuchinternet";
var states = {
    create: {
        button: 'Generate link',
        options: {
            disableDefaultUI: false,
            mapTypeId: 'roadmap',
            scrollwheel: true,
            navigationControl: true,
            mapTypeControl: true,
            scaleControl: true,
            draggable: true
        }
    },
    guess: {
        button: 'Solution',
        options: {
            disableDefaultUI: true,
            mapTypeId: 'guessthecity',
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false
        }
    }
};

button.onclick = function (event) {
    event.preventDefault();

    if (!toggle) {
        window.location.hash = encode();
        map.setOptions(states.guess.options);
        this.innerHTML = states.guess.button;
    } else {
        map.setOptions(states.create.options);
        map.setCenter(center);
        map.setZoom(zoom);
        this.innerHTML = states.create.button;
    }
    toggle = !toggle;
};

function encode() {
    center = map.getCenter();
    zoom = map.getZoom();
    return "v1" + CryptoJS.AES.encrypt(zoom + "|" + center.toJSON().lat + "|" + center.toJSON().lng, passphrase);
}

function decode() {
    var location = CryptoJS.AES.decrypt(window.location.hash.substr(3), passphrase).toString(CryptoJS.enc.Utf8).split("|");
    if (location.length !== 3) {
        return false;
    }
    center = {lat: location[1] * 1, lng: location[2] * 1};
    zoom = location[0] * 1;
    return {center: center, zoom: zoom};
}

function initialize() {
    var options = states.create.options;
    button.innerHTML = states.create.button;
    if (window.location.hash) {
        var custom = decode();
        if (custom) {
            options = states.guess.options;
            options.center = custom.center;
            options.zoom = custom.zoom;
            button.innerHTML = states.guess.button;
            toggle = true;
        }
    }

    if (!options.center) {
        options.center = {lat: 40.684741, lng: -74.029507};
        options.zoom = 8;
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);
    map.mapTypes.set('guessthecity', new google.maps.StyledMapType([
        {
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ]));
}