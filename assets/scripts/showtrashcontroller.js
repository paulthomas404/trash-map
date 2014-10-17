var map = null
function initialize() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            var Latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            var mapOptions = {
                zoom: 13,
                center: Latlng
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);

            getAllTrashes(position);
        });
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

function getAllTrashes(position){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            markTrashes(xmlhttp.responseText);
        }
    }

    xmlhttp.open("POST","http://localhost:1337/trash/getAllTrashes",true);
    xmlhttp.send();
}

function markTrashes(responseText){
    var trashList = eval(responseText);
    for(var i= 0; i<trashList.length;i++){
        var Latlng = new google.maps.LatLng(parseFloat(trashList[i].latitude),parseFloat(trashList[i].longitude));
        var marker = new google.maps.Marker({
            position:Latlng,
            title:"nevil",
            id:trashList[i].id
        })

        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
            var id = this.id;
            var trash = this;
            var xmlhttp;
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    showInfoWindow(trash, eval(xmlhttp.responseText));
                }
            }
            xmlhttp.open("POST","http://localhost:1337/trash/getTrashById?id=" +this.id,true);
            xmlhttp.send();
        });
    }
}

function showInfoWindow(Trash , TrashDetails){
    var contentString = '<div id="content">'+
        '<h1 style="text-align: center" id="landmark" >LandMark</h1>'+
        '<img style="height:200px;width:200px" id="trashpic" src="'+ TrashDetails[0].trash_pic+'"/><br>'+
        '<div style="text-align: center"> '+
        '<button id="addToEventButton" style="background: green;color: white; font-weight: bold">Add to Event</button></div>'
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    infowindow.open(map,Trash);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDBwn-ioI7JNDlEJoSZzbgWsUSRocsjVAs&' +
        'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;