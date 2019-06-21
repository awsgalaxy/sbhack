﻿
$(document).ready(function () {
    SetMenuItemAsActive();
    SubscribeToEvents();
    var trackNumber = getUrlParameter("trackNumber");
    if (trackNumber && trackNumber.length > 0) {
        SearchForPackage(trackNumber);
    }
});

function SubscribeToEvents() {
    $("#trackPackage").on("click", function () {
        SearchForPackage();
    });


    $('#packageNumber').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            SearchForPackage();
        }
    });
}

function SetMenuItemAsActive() {
    $("#track-package-menu-item").addClass("active-sm").addClass("active");
}

var packageInfo = null;
var packageHistory = [];

function SearchForPackage(trackNumber) {
    if (!trackNumber || trackNumber.length == 0) {
        trackNumber = $("#packageNumber").val();
        if (!trackNumber || trackNumber.lenght == 0)
            return;
    }
   
    getPackageInfo(trackNumber);
    getPackageHistory(trackNumber);

}

function getPackageInfo(packageNumber) {
    showSpinner();
    $.get("/Package/GetPackageInfoByTrackNumber?trackNumber=" + packageNumber, function (data) {
        hideSpinner();
        fillPackageInfo(data);
    });
}

function getPackageHistory(packageNumber) {
    showSpinner();
    $.get("/Package/GetPackageHistoryByTrackNumber?trackNumber=" + packageNumber, function (data) {
        hideSpinner();
        fillPackageHistory(data);
        showMap(data);
        initChart(data);
       
    });
}

var temperatureKey = "temperature";
var humidityKey = "humidity";
var presureKey = "presure";
var lightKey = "light";
var accelerationKey = "acceleration";

function initChart(data) {
    var optionsHtml = "";
    var sensorNames = data[0].sensors.map(function (e) { return e.name; });
    $.each(sensorNames, function (index, value) {
        optionsHtml += "<option value='" + value + "'>" + value.charAt(0).toUpperCase() + value.slice(1)+"</option>"
    });

    $("#sensors-drop-down").on("change", function (e, r, t, y) {
        var sensorName = $(this).val();
        drawChart(packageHistory, sensorName);
    });

    $(optionsHtml).appendTo($("#sensors-drop-down"));


    drawChart(data, sensorNames[0]);
}

function fillPackageInfo(packageInfo) {
    if (!packageInfo) {
        $(".search-empty-result-container").show();
        return;
    }

    $(".search-empty-result-container").hide();

    $("#packageTitle").text(packageInfo.title);
    $("#trackNumber").text(packageInfo.trackNumber);
    $("#packageDescription").text(packageInfo.description);
    $("#packageWeight").text(packageInfo.weight);
    $("#packageHeight").text(packageInfo.height);
    $("#packageWidth").text(packageInfo.width);
    $("#packageLenght").text(packageInfo.lenght);

    $(".package-Info").show();
}
function fillPackageHistory(data) {
    if (data.length == 0) {
        $(".search-empty-result-container").show();
        return;
    }
    packageHistory = data;

    var tableHeading = getTableHeadingHtml(packageHistory[0].sensors);
    $("#packageHistory thead").empty();
    $(tableHeading).appendTo($("#packageHistory thead"));

    var rowsHtml = getTableRowsHtml(packageHistory);
    $("#packageHistory tbody").empty();
    $(rowsHtml).appendTo($("#packageHistory tbody"));

    $(".search-empty-result-container").hide();
    $(".package-Info").show();
}
function getTableRowsHtml(data) {
    var html = "";
    $.each(data, function (index, value) {

        html += "<tr class='" + (index % 2 == 0 ? "even" : "odd") + "'> ";
        html += "<td class='measuring-date'>" + moment(value.date).format('LLLL') + "</td>";

        if (checkIfSensorExists(value.sensors, temperatureKey)) {
            var temperature = getSensorInfo(value, temperatureKey);
            html += "<td class='temperature " + (temperature.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + temperature.data + " " + getMesurementUnit(temperatureKey) + " </td>";
        }
        if (checkIfSensorExists(value.sensors, humidityKey)) {
            var humidity = getSensorInfo(value, humidityKey);
            html += "<td class='humidity " + (humidity.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + humidity.data + " " + getMesurementUnit(humidityKey) + " </td>";
        }
        if (checkIfSensorExists(value.sensors, presureKey)) {
            var presure = getSensorInfo(value, presureKey);
            html += "<td class='presure " + (presure.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + presure.data + " " + getMesurementUnit(presureKey) + " </td>";
        }
        if (checkIfSensorExists(value.sensors, lightKey)) {
            var light = getSensorInfo(value, lightKey);
            html += "<td class='light " + (light.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + light.data + " " + getMesurementUnit(lightKey) + " </td>";
        }
        if (checkIfSensorExists(value.sensors, accelerationKey)) {
            var acceleration = getSensorInfo(value, accelerationKey);
            html += "<td class='light " + (acceleration.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + acceleration.data + " " + getMesurementUnit(accelerationKey) + " </td>";
        }
        html += "</tr>";
    });
    return html;
}
function getTableHeadingHtml(data) {
    var html = "<tr class='headings'>";
    html += "<th class='column-title'>Measuring Date </th>";

    if (checkIfSensorExists(data, temperatureKey))
        html += "<th class='column-title'>Temperature </th>";
    if (checkIfSensorExists(data, humidityKey))
        html += "<th class='column-title'>Humidity </th>";
    if (checkIfSensorExists(data, presureKey))
        html += "<th class='column-title'>Pressure </th>";
    if (checkIfSensorExists(data, lightKey))
        html += "<th class='column-title'>Light </th>";
    if (checkIfSensorExists(data, accelerationKey))
        html += "<th class='column-title'>Acceleration </th>";

    html += "</tr>";
    return html;
}
function checkIfSensorExists(array, name) {
    return $.grep(array, function (e) { return e.name == name; }).length > 0;
}
function getSensorInfo(deviceInfo, sensorName) {
    var values = $.grep(deviceInfo.sensors, function (e) { return e.name == sensorName; });
    if (values.lenght == 0)
        return null;
    return values[0];
}

let map;
var infoWindows = [];

function initMap() {
    const mapDiv = $('#map')[0];
    map = new google.maps.Map(mapDiv, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
    });

}

function showMap(data) {
    var markerArray = [];
    $.each(data, function (index, value) {
        markerArray.push(addMarkerToMap(value));
    });

    var flightPath = new google.maps.Polyline({
        path: markerArray,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}

function addMarkerToMap(deviceInfo) {
    var latlong = { lat: deviceInfo.lat, lng: deviceInfo.lng };

    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        content: "hello <b>World</b>"
    });

    attachMarkerDescription(marker, getDeviceDescription(deviceInfo))
    map.setCenter(new google.maps.LatLng(deviceInfo.lat, deviceInfo.lng));
    return latlong;
}

function getDeviceDescription(deviceInfo) {
    var texts = deviceInfo.sensors.map(function (e) {
        if (!e.isAcceptableMeasure) {
            return "<b>" + e.name + "</b>: <span style='color:red;'>" + e.data + " " + getMesurementUnit(e.name) + "</span>";
        }
        return "<b>" + e.name + "</b>: " + e.data + " " + getMesurementUnit(e.name);
    });
    var result = moment(deviceInfo.date).format('LLLL') + "</br>";
    return result + texts.join("</br>");
}

function getMesurementUnit(name) {
    switch (name) {
        case temperatureKey:
            return "&deg;C";
        case humidityKey:
            return "%";
        case presureKey:
            return "P";
        case lightKey:
            return "Lux";
        case accelerationKey:
            return "m/sec<sup>2</sup>";
    }
}

function attachMarkerDescription(marker, text) {

    google.maps.event.addListener(marker, 'mouseover', function () {
        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setContent(text);
        infoWindow.open(map, marker);
        infoWindows.push(infoWindow);
    });

    google.maps.event.addListener(marker, 'mouseout', function (e, r, t, y) {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    });
}

function drawChart(data, key) {
    var res = data.map(function (e) { return { date: e.date, value: $.grep(e.sensors, function (s) { return s.name == key; })[0].data } });

    var labels = res.map(function (e) { return moment(e.date).format('l'); });
    var values = res.map(function (e) { return e.value; });

    var ctx = document.getElementById("pointsChart");
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Value",
                backgroundColor: "rgba(38, 185, 154, 0.31)",
                borderColor: "rgba(38, 185, 154, 0.7)",
                pointBorderColor: "rgba(38, 185, 154, 0.7)",
                pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointBorderWidth: 1,
                data: values
            }]
        },
    });

}

 function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};