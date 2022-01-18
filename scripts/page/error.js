loadError();

function loadError() {
    switch(errorParam) {
        case '0':
            setCode("000");
            setTitle("Invalid Application Requested");
            setDesc("An invalid application code was entered in the URL. Please remove all URL parameters and try again.");
            break;
        case '100':
            setCode("100");
            setTitle("Invalid Dashboard Layout Requested");
            setDesc("An invalid dashboard code was entered in the URL. Please remove all URL parameters and try again.");
            break;
        case '418':
            setCode("418");
            setTitle("I'm a teapot");
            setDesc("The requested entity body is short and stout.<br/>Tip me over and pour me out.");
            break;
        default:
            setCode("999");
            setTitle("Unknown Error");
            setDesc("Error application either received an invalid error code or did not receive an error code at all.");
            break;
    }
}

function setTitle(titleTXT) {
    document.getElementById("errorTitle").innerHTML = titleTXT;
}
function setCode(codeTXT) {
    document.getElementById("errorCode").innerHTML = codeTXT;
}
function setDesc(descTXT) {
    document.getElementById("errorDescription").innerHTML = descTXT;
}