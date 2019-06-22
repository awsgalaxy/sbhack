
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
    $(".verification.alert-success").css("display", "none");
    $(".verification.alert-danger").css("display", "none");
    $.get("/Package/GetPackageInfoByTrackNumber?trackNumber=" + packageNumber, function (data) {
        hideSpinner();
        fillPackageInfo(data);
        if ((Math.floor((Math.random() * 10) + 1) % 2) == 0)
            $(".verification.alert-success").css("display", "block");
        else
            $(".verification.alert-danger").css("display", "block");
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
    var sensorNames = data.map(function (value) { return value.sensors })
        .reduce(function (a, b) { return a.concat(b.map(function (e) { return e.name })); }, [])
        .filter(function (value, index, self) {
            return self.indexOf(value) === index;
        })

    console.info(sensorNames);

    $.each(sensorNames, function (index, value) {
        optionsHtml += "<option value='" + value + "'>" + value.charAt(0).toUpperCase() + value.slice(1) + "</option>"
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
    $("#productionDate").text(packageInfo.productionDate);
    $("#expirationDate").text(packageInfo.expirationDate);
    $("#producer").text(packageInfo.producer);

    $(".package-Info").show();
}
function fillPackageHistory(data) {
    if (data.length == 0) {
        $(".search-empty-result-container").show();
        return;
    }
    packageHistory = data;

    var sensorNames = packageHistory.map(function (value) { return value.sensors })
        .reduce(function (a, b) { return a.concat(b.map(function (e) { return e })); }, [])
        .filter(function (value, index, self) {
            return self.findIndex(function (v) { return v.name === value.name }) === index;
        });

    var tableHeading = getTableHeadingHtml(sensorNames);
    $("#packageHistory thead").empty();
    $(tableHeading).appendTo($("#packageHistory thead"));

    var rowsHtml = getTableRowsHtml(packageHistory, sensorNames);
    $("#packageHistory tbody").empty();
    $(rowsHtml).appendTo($("#packageHistory tbody"));

    $(".search-empty-result-container").hide();
    $(".package-Info").show();
}
function getTableRowsHtml(data, sensorNames) {
    var html = "";
    $.each(data, function (index, value) {

        html += "<tr class='" + (index % 2 == 0 ? "even" : "odd") + "'> ";
        html += "<td class='measuring-date'>" + moment(value.date).format('LLLL') + "</td>";

        if (checkIfSensorExists(sensorNames, temperatureKey)) {
            var temperature = getSensorInfo(value, temperatureKey);
            html += "<td class='temperature " + (temperature.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + temperature.data + " " + getMesurementUnit(temperatureKey) + " </td>";
        }
        if (checkIfSensorExists(sensorNames, humidityKey)) {
            var humidity = getSensorInfo(value, humidityKey);
            html += "<td class='humidity " + (humidity.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + humidity.data + " " + getMesurementUnit(humidityKey) + " </td>";
        }
        if (checkIfSensorExists(sensorNames, presureKey)) {
            var presure = getSensorInfo(value, presureKey);
            console.info(value);
            console.info(presure);
            html += "<td class='presure " + (presure.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + presure.data + " " + getMesurementUnit(presureKey) + " </td>";
        }
        if (checkIfSensorExists(sensorNames, lightKey)) {
            var light = getSensorInfo(value, lightKey);
            html += "<td class='light " + (light.isAcceptableMeasure ? "" : "not-acceptable") + "'>" + light.data + " " + getMesurementUnit(lightKey) + " </td>";
        }
        if (checkIfSensorExists(sensorNames, accelerationKey)) {
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
    return values[0] || {
        isAcceptableMeasure: true,
        data: "N/A"
    };;
}

let map;
var infoWindows = [];
let bounds;

function initMap() {
    const mapDiv = $('#map')[0];
    map = new google.maps.Map(mapDiv);
    bounds = new google.maps.LatLngBounds();
}

let colors = ["#173f5f",
    // "#20639b",
    "#3caea3",
    //"#f6d55c",
    "#ed553b",
    "#ad4d46",
    "#b3833e",
    "#c1ac58",
    "#78934e",
    "#92cb81"];

function showMap(data) {
    var markerArray = {};
    markerArray = data.reduce(function (accumulator, value) {
        var array = accumulator[value.packageId] || [];
        array.push(addMarkerToMap(value))
        accumulator[value.packageId] = array;
        return accumulator;
    }, {})

    var arrayKeys = Object.keys(markerArray);

    //$.each(markerArray, function (index, value) {
    //    markerArray[index] = value.sort(function (a, b) { return new Date(a) - new Date(b) });
    //});

    $.each(markerArray, function (index, value) {
        var flightPath = new google.maps.Polyline({
            path: value,
            geodesic: true,
            strokeColor: colors[arrayKeys.indexOf(index)],
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        flightPath.setMap(map);
    });

    map.fitBounds(bounds);
    map.panToBounds(bounds);
}

function addMarkerToMap(deviceInfo) {
    var latlong = { lat: deviceInfo.lat, lng: deviceInfo.lng };

    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        content: "hello <b>World</b>"
    });

    attachMarkerDescription(marker, getDeviceDescription(deviceInfo))
    bounds.extend(latlong);
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
    var res = data.map(function (e) {
        var sensor = e.sensors.find(function (s) { return s.name == key; });
        return {
            date: e.date, value: sensor ? sensor.data : 0
        }
    });

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
