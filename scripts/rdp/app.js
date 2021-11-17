function loadApp() {
    // Set Navigation Title
    setTimeout(function () {
    setPageName("Remote Desktop");
    }, 500);       
}

function generalConnect() {
    var host = document.getElementById('hostname').value;
    window.open('rdp://'+host);
}