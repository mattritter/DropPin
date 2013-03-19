Titanium.UI.setBackgroundColor('#000');

var win = Titanium.UI.createWindow({  
    title:'DropPin',
    backgroundColor:'#fff'
});

var currentLatitude;
var currentLongitude;

var fadeIn = Ti.UI.createAnimation({
    opacity : 1,
    duration : 250
});

var fadeOut = Ti.UI.createAnimation({
    opacity : 0,
    duration : 250
});

openDialog = function(evt) {

    Ti.API.info('ID: ' + evt.annotation.myid);

    if (evt.annotation.myid == "userPin" && evt.clicksource == "rightButton") {

        Ti.API.info('Open Dialog');

        var dialog = Titanium.UI.createOptionDialog({
            title : 'Choose',
            options : ['Share Location', 'Get Directions', 'Remove Pin', 'Cancel'],
            cancel : 3,
        });

        dialog.show();

        dialog.addEventListener('click', function(e) {

            Ti.API.info(e.index);

            var shareLat = Ti.App.Properties.getString('userPinLat');
            var shareLong = Ti.App.Properties.getString('userPinLong');

            if (e.index == 0) {

                var socialDialog = Titanium.UI.createOptionDialog({
                    title : 'Share via',
                    options : ['E-Mail', 'Facebook', 'Twitter', 'Cancel'],
                    cancel : 3,
                });

                socialDialog.show();

                socialDialog.addEventListener('click', function(e) {

                    if (e.index == 0) {

                       //e-mail dialog

                    } else if (e.index == 1) {

                        //facebook share

                    } else if (e.index == 2) {

                        //twitter share

                    }

                });

            } else if (e.index == 1) {

                if (Titanium.Platform.version >= 6.0) {

                    Titanium.Platform.openURL("https://maps.apple.com/maps?q=" + shareLat + "," + shareLong);

                } else {

                    Titanium.Platform.openURL("https://maps.google.com/maps?q=" + shareLat + "," + shareLong);

                }

            } else if (e.index == 2) {

                removePin();

            } else if (e.index == 3) {

                Ti.API.info('Cancel!');

            }

        });

    } else if (evt.annotation.myid != "userPin" && evt.clicksource == "rightButton") {

        var dialog = Titanium.UI.createOptionDialog({
            title : 'Choose an option',
            options : ['Get Directions', 'Cancel'],
            cancel : 1,
        });

        dialog.show();

        dialog.addEventListener('click', function(e) {

            var shareLat = Ti.App.Properties.getString('userPinLat');
            var shareLong = Ti.App.Properties.getString('userPinLong');

            Ti.API.info('Version:' + Titanium.Platform.version);

            if (e.index == 0) {

                if (Titanium.Platform.version >= 6.0) {

                    Titanium.Platform.openURL("https://maps.apple.com/maps?q=" + shareLat + "," + shareLong);

                } else {

                    Titanium.Platform.openURL("https://maps.google.com/maps?q=" + shareLat + "," + shareLong);

                }

            }

        });

    }

};

openModal = function(e) {

    infoView.setVisible(true);

    infoView.animate(fadeIn);

    modalClose.addEventListener('click', closeModal);

};

closeModal = function(e) {

    infoView.animate(fadeOut);

    setTimeout(function() {

        infoView.setVisible(false);

    }, 250);

    Titanium.App.Properties.setBool('modalViewed', true);

};

dragPin = function(e) {

    var newPinState = e.newState;

    switch (newPinState) {
        case 0:

            Ti.API.info('Pin settled in new location: ' + [e.annotation.latitude, ',', e.annotation.longitude].join(''));

            Titanium.App.Properties.setString('userPinLong', e.annotation.longitude);
            Titanium.App.Properties.setString('userPinLat', e.annotation.latitude);

            Ti.API.info('Set Data To New Location: ' + Ti.App.Properties.getString('userPinLat') + ',' + Ti.App.Properties.getString('userPinLong'));

            break;

        case 1:
            //Ti.API.info('Pin has been selected in current location: ' + [e.annotation.latitude, ',', e.annotation.longitude].join(''));
            break;
        case 2:
            //Ti.API.info('Pin is selected and is able to be dragged...');
            break;
        case 4:
            //Ti.API.info('Pin has been released/dropped in new location...');
            break;
    }

};

removePin = function(e) {

    Ti.API.info('Remove pin');

    mapview.removeAnnotation(userPin);

    pinDropped = false;

    dropPinButton.enabled = true;

    Titanium.App.Properties.removeProperty('userPinLong');

    Titanium.App.Properties.removeProperty('userPinLat');

};

dropPin = function(dropX, dropY) {

    Ti.API.info('Pin dropped: ' + dropX + ',' + dropY);

    userPin.setLatitude(dropX);

    userPin.setLongitude(dropY);

    mapview.addAnnotation(userPin);

    Titanium.App.Properties.setString('userPinLat', dropX);

    Titanium.App.Properties.setString('userPinLong', dropY);

    pinDropped = true;

    dropPinButton.enabled = false;

    mapview.addEventListener('pinchangedragstate', dragPin);

};

var mapview = Titanium.Map.createView({

    mapType : Titanium.Map.HYBRID_TYPE,
    region : {
        latitude : 33.03727,
        longitude : -97.28109,
        latitudeDelta : 0.004,
        longitudeDelta : 0.004
    },
    regionFit : true,
    userLocation : true,

});

mapview.addEventListener('regionChanged', function(e) {

    currentLatitude = e.latitude;
    currentLongitude = e.longitude;

});

var mapData = [{
    aName : "Ticket Office/Credentials",
    latitude : 33.030633,
    longitude : -97.275647,
}, {
    aName : "Speedway Club",
    latitude : 33.032667,
    longitude : -97.283897,
}, {
    aName : "Gate 4",
    latitude : 33.037506,
    longitude : -97.285169,
}, {
    aName : "Dirt Track",
    latitude : 33.033086,
    longitude : -97.274450,
}, {
    aName : "Event First Aid Station",
    latitude : 33.033508,
    longitude : -97.286497,
}, {
    aName : "Village of Champions",
    latitude : 33.032522,
    longitude : -97.286467,
}, {
    aName : "Brookshire's Tent",
    latitude : 33.036867,
    longitude : -97.273769,
}, {
    aName : "South Tunnel",
    latitude : 33.032211,
    longitude : -97.282867,
}, {
    aName : "Fuzzy’s Taco Shop",
    latitude : 33.036875,
    longitude : -97.281864,
}, {
    aName : "Public Safety Building",
    latitude : 33.038994,
    longitude : -97.273864,
}, {
    aName : "Cup Garage",
    latitude : 33.036308,
    longitude : -97.282625,
}, {
    aName : "Barr Tunnel",
    latitude : 33.035078,
    longitude : -97.284642,
}];

for (var i = 0; i < mapData.length; i++) {

    var aTitle = mapData[i].aName;
    var aLat = mapData[i].latitude;
    var aLong = mapData[i].longitude;

    var annotation = Titanium.Map.createAnnotation({
        latitude : aLat,
        longitude : aLong,
        title : aTitle,
        subtitle : 'Texas Motor Speedway',
        pincolor : Titanium.Map.ANNOTATION_RED,
        //animate : true,
        myid : i,
        rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
    });

    mapview.addAnnotation(annotation);

}

var dropPinButton = Ti.UI.createButton({

    backgroundImage : 'imgs/dropPin.png',
    backgroundColor : 'transparent',
    width : 61,
    height : 62,
    bottom : 0,
    right : 0,

});

var userPin = Titanium.Map.createAnnotation({
    latitude : dropX,
    longitude : dropY,
    title : "My Saved Location",
    subtitle : 'Press and hold pin to drag.',
    animate : true,
    pincolor : Titanium.Map.ANNOTATION_PURPLE,
    rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
    draggable : true,
    myid : 'userPin',
});

win.add(mapview);
win.add(dropPinButton);

mapview.addEventListener('click', openDialog);

if (Titanium.App.Properties.hasProperty('userPinLat')) {

    var dropX = Ti.App.Properties.getString('userPinLat');
    var dropY = Ti.App.Properties.getString('userPinLong');

    dropPin(dropX, dropY);

    dropPinButton.enabled = false;

} else {

    Ti.API.info('No current pin dropped');

    dropPinButton.enabled = true;

}

dropPinButton.addEventListener('click', function(e) {

    var dropX = currentLatitude;
    var dropY = currentLongitude;

    dropPin(dropX, dropY);

});

win.open();
