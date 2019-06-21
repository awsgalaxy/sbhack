var baseAddress = "https://localhost:44388";

$(document).ready(function () {
    InitMenuItems();

});

function InitMenuItems() {
    $("#add-package-menu-item").on("click", function () {
        window.location.href = "/Package/CreatePackage";
    });
    $("#track-package-menu-item").on("click", function () {
        window.location.href = "/Package/TrackPackage";
    });
}

function showSpinner() {
    $(".spinner").show();
}

function hideSpinner() {
    $(".spinner").hide();
}